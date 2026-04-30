"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Square, PlusCircle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInSeconds, differenceInMinutes } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimeEntry {
  id: string;
  projectName: string;
  clientName: string | null;
  hourlyRate: number | null;
  startedAt: string;
  stoppedAt: string | null;
  status: string;
  description: string | null;
}

interface TimeTrackerClientProps {
  entries: TimeEntry[];
  runningEntry: TimeEntry | null;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m > 0 ? m + "m" : ""}`.trim();
}

export function TimeTrackerClient({ entries, runningEntry }: TimeTrackerClientProps) {
  const [running, setRunning] = useState(runningEntry);
  const [elapsed, setElapsed] = useState(0);
  const [project, setProject] = useState("");
  const [client, setClient] = useState("");
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [allEntries, setAllEntries] = useState(entries);

  // Tick timer
  useEffect(() => {
    if (!running) return;
    const start = new Date(running.startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Stats
  const totalMinutes = allEntries
    .filter((e) => e.stoppedAt)
    .reduce((sum, e) => {
      return sum + differenceInMinutes(new Date(e.stoppedAt!), new Date(e.startedAt));
    }, 0);

  const totalEarnings = allEntries
    .filter((e) => e.stoppedAt && e.hourlyRate)
    .reduce((sum, e) => {
      const hrs = differenceInSeconds(new Date(e.stoppedAt!), new Date(e.startedAt)) / 3600;
      return sum + hrs * (e.hourlyRate ?? 0);
    }, 0);

  const effectiveRate = totalMinutes > 0 ? (totalEarnings / (totalMinutes / 60)) : 0;

  async function handleStart() {
    if (!project) { toast.error("Enter a project name"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: project, clientName: client || null, hourlyRate: rate ? parseFloat(rate) : null }),
      });
      if (!res.ok) throw new Error("Failed to start timer");
      const data = await res.json() as TimeEntry;
      setRunning(data);
      setElapsed(0);
      toast.success("Timer started!");
    } catch { toast.error("Failed to start timer"); }
    finally { setLoading(false); }
  }

  async function handleStop() {
    if (!running) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/time/${running.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to stop timer");
      const data = await res.json() as TimeEntry;
      setRunning(null);
      setAllEntries((prev) => [data, ...prev.filter((e) => e.id !== data.id)]);
      setProject("");
      setClient("");
      setRate("");
      toast.success("Timer stopped!");
    } catch { toast.error("Failed to stop timer"); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-700 text-2xl">Time Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Track billable hours and see your effective hourly rate.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, label: "This month", value: formatHours(totalMinutes), color: "text-primary" },
          { icon: DollarSign, label: "Earnings", value: `$${totalEarnings.toFixed(0)}`, color: "text-green-500" },
          { icon: TrendingUp, label: "Effective rate", value: `$${effectiveRate.toFixed(0)}/hr`, color: "text-amber-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-heading font-700 text-xl">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Timer */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <AnimatePresence mode="wait">
          {running ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                <span className="font-medium">{running.projectName}</span>
                {running.clientName && <Badge variant="secondary" className="text-xs">{running.clientName}</Badge>}
              </div>
              <p className="font-heading font-700 text-5xl tabular-nums">{formatDuration(elapsed)}</p>
              {running.hourlyRate && (
                <p className="text-sm text-muted-foreground">
                  Earning: <span className="text-green-500 font-medium">${((elapsed / 3600) * running.hourlyRate).toFixed(2)}</span>
                </p>
              )}
              <Button onClick={handleStop} disabled={loading} variant="destructive" size="lg" className="gap-2">
                <Square className="w-4 h-4" />
                Stop timer
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="stopped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="font-heading font-600 text-sm text-muted-foreground">Start a new timer</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Project *</Label>
                  <Input placeholder="Client website" value={project} onChange={(e) => setProject(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Client</Label>
                  <Input placeholder="Acme Corp" value={client} onChange={(e) => setClient(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Hourly rate ($)</Label>
                  <Input type="number" placeholder="75" value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleStart} disabled={loading} size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Start timer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Entries */}
      {allEntries.length > 0 && (
        <div>
          <h2 className="font-heading font-600 text-base mb-3">This month</h2>
          <div className="space-y-2">
            {allEntries.filter((e) => e.stoppedAt).map((entry) => {
              const mins = differenceInMinutes(new Date(entry.stoppedAt!), new Date(entry.startedAt));
              const earnings = entry.hourlyRate ? (mins / 60) * entry.hourlyRate : null;
              return (
                <div key={entry.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="font-medium text-sm truncate">{entry.projectName}</p>
                      {entry.clientName && <p className="text-xs text-muted-foreground">{entry.clientName}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm shrink-0">
                    <span className="text-muted-foreground text-xs">{format(new Date(entry.startedAt), "MMM d")}</span>
                    <span className="font-medium">{formatHours(mins)}</span>
                    {earnings !== null && <span className="text-green-500 font-medium">${earnings.toFixed(0)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

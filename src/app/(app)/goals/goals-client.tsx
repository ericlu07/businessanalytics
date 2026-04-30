"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, PlusCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  title: string;
  targetValue: number;
  status: string;
  deadline: string | null;
  metricId: string;
  metric: { name: string; prefix: string | null; unit: string | null };
}

interface Metric {
  id: string;
  name: string;
  prefix: string | null;
  unit: string | null;
}

interface GoalsClientProps {
  goals: Goal[];
  metrics: Metric[];
  latestData: Record<string, number>;
}

export function GoalsClient({ goals, metrics, latestData }: GoalsClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [metricId, setMetricId] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");

  function getPct(goal: Goal) {
    if (goal.targetValue === 0) return 0;
    const current = latestData[goal.metricId] ?? 0;
    return Math.min((current / goal.targetValue) * 100, 100);
  }

  async function handleCreate() {
    if (!title || !metricId || !target) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, metricId, targetValue: parseFloat(target), deadline: deadline || null }),
      });
      if (!res.ok) throw new Error("Failed to create goal");
      toast.success("Goal created!");
      setOpen(false);
      setTitle("");
      setMetricId("");
      setTarget("");
      setDeadline("");
      router.refresh();
    } catch {
      toast.error("Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  }

  function GoalCard({ goal }: { goal: Goal }) {
    const pct = getPct(goal);
    const current = latestData[goal.metricId] ?? 0;
    const fmt = (v: number) => `${goal.metric.prefix ?? ""}${v.toLocaleString()}${goal.metric.unit ? " " + goal.metric.unit : ""}`;

    return (
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {pct >= 100 ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <Target className="w-4 h-4 text-primary shrink-0" />
            )}
            <h3 className="font-medium text-sm truncate">{goal.title}</h3>
          </div>
          <Badge variant={pct >= 100 ? "default" : "outline"} className={cn("shrink-0 text-xs", pct >= 100 && "bg-green-500 hover:bg-green-500")}>
            {pct >= 100 ? "Completed" : `${pct.toFixed(0)}%`}
          </Badge>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-heading font-600">{fmt(current)}</span>
            <span className="text-muted-foreground text-xs">Target: {fmt(goal.targetValue)}</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {goal.metric.name}
          </span>
          {goal.deadline && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(goal.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-700 text-2xl">Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set targets for your metrics and track progress.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <PlusCircle className="w-4 h-4" />
            New goal
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create a goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Goal title</Label>
                <Input placeholder="e.g. Hit $5,000/month revenue" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Metric</Label>
                <Select value={metricId} onValueChange={(v) => setMetricId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a metric..." />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Target value</Label>
                <Input type="number" placeholder="5000" value={target} onChange={(e) => setTarget(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Deadline (optional)</Label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={submitting}>
                Create goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active goals */}
      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading font-600 text-xl mb-2">No goals yet</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Set a revenue target, client goal, or any metric target to start tracking progress.
          </p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Create your first goal
          </Button>
        </motion.div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div>
              <h2 className="font-heading font-600 text-base mb-4 text-muted-foreground uppercase tracking-wider text-xs">Active — {activeGoals.length}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          )}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="font-heading font-600 text-base mb-4 text-muted-foreground uppercase tracking-wider text-xs">Completed — {completedGoals.length}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

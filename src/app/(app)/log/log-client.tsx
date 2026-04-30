"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Upload, History } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Metric {
  id: string;
  name: string;
  prefix: string | null;
  unit: string | null;
}

interface DataPoint {
  id: string;
  value: number;
  note: string | null;
  recordedAt: string;
  metric: { name: string; prefix: string | null; unit: string | null };
}

interface LogClientProps {
  metrics: Metric[];
  recentPoints: DataPoint[];
}

export function LogClient({ metrics, recentPoints }: LogClientProps) {
  const router = useRouter();
  const [metricId, setMetricId] = useState("");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [submitting, setSubmitting] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [points, setPoints] = useState(recentPoints);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleLog() {
    if (!metricId || !value) { toast.error("Select a metric and enter a value"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/data-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metricId, value: parseFloat(value), note: note || null, recordedAt: new Date(date).toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to log");
      const newPoint = await res.json() as DataPoint;
      toast.success("Data point logged!");
      setPoints((prev) => [newPoint, ...prev]);
      setValue("");
      setNote("");
    } catch { toast.error("Failed to log data"); }
    finally { setSubmitting(false); }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target?.result as string ?? "");
    reader.readAsText(file);
  }

  async function handleCsvImport() {
    if (!csvText || !metricId) { toast.error("Select a metric and provide CSV data"); return; }
    setCsvLoading(true);
    try {
      const lines = csvText.trim().split("\n").slice(1); // skip header
      const points = lines.map((line) => {
        const [dateStr, valueStr, noteStr] = line.split(",").map((s) => s.trim());
        return { metricId, value: parseFloat(valueStr ?? "0"), recordedAt: new Date(dateStr ?? "").toISOString(), note: noteStr ?? null };
      }).filter((p) => !isNaN(p.value) && !isNaN(new Date(p.recordedAt).getTime()));

      const res = await fetch("/api/data-points/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
      });
      if (!res.ok) throw new Error("Failed to import");
      toast.success(`Imported ${points.length} data points!`);
      setCsvText("");
      router.refresh();
    } catch { toast.error("Import failed. Check your CSV format."); }
    finally { setCsvLoading(false); }
  }

  const selectedMetric = metrics.find((m) => m.id === metricId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-700 text-2xl">Log Data</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add data points to your metrics manually or import from CSV.
        </p>
      </div>

      {metrics.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground mb-4">You need to add metrics before logging data.</p>
          <Link href="/metrics">
            <Button>Browse metric library</Button>
          </Link>
        </div>
      ) : (
        <Tabs defaultValue="manual">
          <TabsList>
            <TabsTrigger value="manual" className="gap-2">
              <PlusCircle className="w-3.5 h-3.5" />
              Manual entry
            </TabsTrigger>
            <TabsTrigger value="csv" className="gap-2">
              <Upload className="w-3.5 h-3.5" />
              CSV import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Metric *</Label>
                  <Select value={metricId} onValueChange={(v) => setMetricId(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose metric..." />
                    </SelectTrigger>
                    <SelectContent>
                      {metrics.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>
                    Value {selectedMetric?.prefix && <span className="text-muted-foreground">({selectedMetric.prefix})</span>}
                    {selectedMetric?.unit && <span className="text-muted-foreground"> in {selectedMetric.unit}</span>}
                  </Label>
                  <Input type="number" placeholder="0.00" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Note (optional)</Label>
                  <Input placeholder="e.g. Big client payment" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleLog} disabled={submitting} className="w-full sm:w-auto gap-2">
                <PlusCircle className="w-4 h-4" />
                {submitting ? "Logging..." : "Log data point"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="csv" className="mt-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">CSV format</h3>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs text-muted-foreground">
                  date,value,note<br />
                  2024-01-01,1500,January revenue<br />
                  2024-02-01,2200,February revenue
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Metric *</Label>
                <Select value={metricId} onValueChange={(v) => setMetricId(v ?? "")}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Choose metric..." />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload CSV file
                </Button>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                <p className="text-xs text-muted-foreground">or paste CSV directly:</p>
                <Textarea
                  placeholder="date,value,note&#10;2024-01-01,1500,January revenue"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
              <Button onClick={handleCsvImport} disabled={csvLoading || !csvText} className="gap-2">
                <Upload className="w-4 h-4" />
                {csvLoading ? "Importing..." : "Import data"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Recent entries */}
      {points.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-heading font-600 text-sm">Recent entries (this month)</h2>
          </div>
          <div className="space-y-2">
            {points.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium truncate">{p.metric.name}</span>
                  {p.note && <span className="text-muted-foreground text-xs truncate hidden sm:block">— {p.note}</span>}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-muted-foreground text-xs">{format(new Date(p.recordedAt), "MMM d")}</span>
                  <span className="font-heading font-600">
                    {p.metric.prefix}{p.value.toLocaleString()}{p.metric.unit ? ` ${p.metric.unit}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

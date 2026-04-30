"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, PlusCircle, Download, Share2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

const REPORT_TYPES = [
  { value: "monthly_summary", label: "Monthly Business Summary", desc: "All KPIs, trends, and goal progress" },
  { value: "income_expense", label: "Income & Expense Summary", desc: "Revenue breakdown and expense categories" },
  { value: "client_report", label: "Client Report", desc: "Project performance for a specific client" },
  { value: "growth_report", label: "Growth Report", desc: "Month-over-month growth across all metrics" },
];

interface Report {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  shareToken: string | null;
}

interface Metric {
  id: string;
  name: string;
}

interface ReportsClientProps {
  reports: Report[];
  metrics: Metric[];
}

export function ReportsClient({ reports, metrics }: ReportsClientProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [allReports, setAllReports] = useState(reports);

  async function handleGenerate() {
    if (!type) { toast.error("Select a report type"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title: title || `${REPORT_TYPES.find((r) => r.value === type)?.label} — ${format(new Date(), "MMMM yyyy")}` }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const report = await res.json() as Report;
      setAllReports((prev) => [report, ...prev]);
      toast.success("Report generated!");
      setOpen(false);
      setType("");
      setTitle("");
    } catch { toast.error("Failed to generate report"); }
    finally { setGenerating(false); }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-700 text-2xl">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate and share business reports.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <PlusCircle className="w-4 h-4" />
            New report
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate a report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                {REPORT_TYPES.map((rt) => (
                  <button
                    key={rt.value}
                    onClick={() => setType(rt.value)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${type === rt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                  >
                    <p className="font-medium text-sm">{rt.label}</p>
                    <p className="text-xs text-muted-foreground">{rt.desc}</p>
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label>Custom title (optional)</Label>
                <Input placeholder="Leave blank for auto-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleGenerate} disabled={generating || !type}>
                {generating ? "Generating..." : "Generate report"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {allReports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading font-600 text-xl mb-2">No reports yet</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Generate beautiful summaries of your business performance to share with clients or investors.
          </p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Generate your first report
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allReports.map((report) => (
            <div key={report.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{report.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs py-0">
                      {REPORT_TYPES.find((r) => r.value === report.type)?.label ?? report.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(report.createdAt), "MMM d, yyyy")}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                    <Share2 className="w-3 h-3" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

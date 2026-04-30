"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { MetricDef } from "@/lib/metrics/library";

interface UserMetric {
  id: string;
  name: string;
  builtInKey: string | null;
}

interface MetricsClientProps {
  builtInMetrics: MetricDef[];
  userMetrics: UserMetric[];
  categoryLabels: Record<string, string>;
  businessType: string;
}

export function MetricsClient({ builtInMetrics, userMetrics, categoryLabels, businessType }: MetricsClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const addedKeys = new Set(userMetrics.map((m) => m.builtInKey).filter(Boolean));

  const categories = [...new Set(builtInMetrics.map((m) => m.category))];

  const filtered = builtInMetrics.filter((m) => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Recommended for this business type
  const recommended = builtInMetrics.filter(
    (m) => m.businessTypes?.includes(businessType) && !addedKeys.has(m.key)
  ).slice(0, 6);

  async function handleAdd(metric: MetricDef) {
    if (addedKeys.has(metric.key)) return;
    setAdding(metric.key);
    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: metric.name,
          description: metric.description,
          category: metric.category,
          builtInKey: metric.key,
          prefix: metric.prefix ?? null,
          unit: metric.unit ?? null,
          icon: metric.icon,
        }),
      });
      if (!res.ok) throw new Error("Failed to add metric");
      toast.success(`${metric.name} added to your metrics!`);
      addedKeys.add(metric.key);
      window.location.reload();
    } catch {
      toast.error("Failed to add metric");
    } finally {
      setAdding(null);
    }
  }

  function MetricCard({ metric }: { metric: MetricDef }) {
    const added = addedKeys.has(metric.key);
    const isAdding = adding === metric.key;

    return (
      <div className={cn("bg-card border border-border rounded-xl p-4 flex flex-col gap-3 group", !added && "card-hover")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{metric.name}</span>
              {metric.prefix && <span className="text-xs text-muted-foreground">{metric.prefix}...</span>}
              {metric.unit && <span className="text-xs text-muted-foreground">...{metric.unit}</span>}
            </div>
            <Badge variant="outline" className="text-xs py-0">
              {categoryLabels[metric.category] ?? metric.category}
            </Badge>
          </div>
          <Button
            size="sm"
            variant={added ? "secondary" : "outline"}
            className={cn("shrink-0 gap-1.5 h-7 text-xs", added && "cursor-default")}
            onClick={() => !added && handleAdd(metric)}
            disabled={added || isAdding}
          >
            {added ? (
              <><Check className="w-3 h-3" />Added</>
            ) : isAdding ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <><Plus className="w-3 h-3" />Add</>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
        {metric.healthNote && (
          <p className="text-xs text-primary/70 bg-primary/5 rounded-lg px-2.5 py-1.5">
            💡 {metric.healthNote}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-700 text-2xl">Metric Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {builtInMetrics.length}+ pre-built metrics. Add any to your dashboard with one click.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search metrics..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className="text-xs h-9"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className="text-xs h-9"
            >
              {categoryLabels[cat] ?? cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && !search && !activeCategory && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="font-heading font-600 text-sm">Recommended for your business</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((m) => <MetricCard key={m.key} metric={m} />)}
          </div>
        </div>
      )}

      {/* All metrics */}
      <div>
        {!search && !activeCategory && (
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-heading font-600 text-sm text-muted-foreground">All metrics</h2>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No metrics found for &ldquo;{search}&rdquo;
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          >
            {filtered.map((m) => (
              <motion.div
                key={m.key}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              >
                <MetricCard metric={m} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

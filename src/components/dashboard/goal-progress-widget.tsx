"use client";

import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalProgressWidgetProps {
  title: string;
  current: number;
  target: number;
  prefix?: string;
  suffix?: string;
  deadline?: string;
  isLoading?: boolean;
}

export function GoalProgressWidget({
  title,
  current,
  target,
  prefix = "",
  suffix = "",
  deadline,
  isLoading,
}: GoalProgressWidgetProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="animate-shimmer h-4 w-32 rounded mb-4" />
        <div className="animate-shimmer h-3 rounded mb-2" />
        <div className="animate-shimmer h-3 w-2/3 rounded" />
      </div>
    );
  }

  const pct = Math.min((current / target) * 100, 100);
  const completed = pct >= 100;
  const fmt = (v: number) => `${prefix}${v.toLocaleString()}${suffix}`;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {completed ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        ) : (
          <Target className="w-4 h-4 text-primary shrink-0" />
        )}
        <p className="text-sm font-heading font-600 truncate">{title}</p>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-heading font-700 text-lg tabular-nums">{fmt(current)}</span>
        <span className="text-muted-foreground text-xs">of {fmt(target)}</span>
      </div>

      <Progress value={pct} className="h-2 mb-2" />

      <div className="flex items-center justify-between">
        <span
          className={cn("text-xs font-medium", {
            "text-green-500": completed,
            "text-primary": !completed && pct >= 75,
            "text-amber-500": !completed && pct >= 40 && pct < 75,
            "text-muted-foreground": pct < 40,
          })}
        >
          {completed ? "Goal reached! 🎉" : `${pct.toFixed(0)}% complete`}
        </span>
        {deadline && !completed && (
          <span className="text-xs text-muted-foreground">{deadline}</span>
        )}
      </div>
    </div>
  );
}

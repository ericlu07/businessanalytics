"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
} from "recharts";

interface KpiTileProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changePeriod?: string;
  sparklineData?: { v: number }[];
  healthStatus?: "good" | "warning" | "bad" | null;
  healthNote?: string;
  isLoading?: boolean;
}

export function KpiTile({
  title,
  value,
  prefix = "",
  suffix = "",
  change,
  changePeriod = "vs last month",
  sparklineData,
  healthStatus,
  healthNote,
  isLoading,
}: KpiTileProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <div className="animate-shimmer h-4 w-24 rounded" />
        <div className="animate-shimmer h-8 w-32 rounded" />
        <div className="animate-shimmer h-3 w-20 rounded" />
      </div>
    );
  }

  const healthColors = {
    good: "text-green-500 bg-green-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    bad: "text-destructive bg-destructive/10",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 group card-hover relative overflow-hidden">
      {/* Health status dot */}
      {healthStatus && (
        <div className={cn("absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse-dot", {
          "bg-green-500": healthStatus === "good",
          "bg-amber-500": healthStatus === "warning",
          "bg-destructive": healthStatus === "bad",
        })} />
      )}

      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>

      <div className="flex items-end justify-between gap-2">
        <p className="font-heading font-700 text-2xl count-up tabular-nums">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </p>

        {sparklineData && sparklineData.length > 1 && (
          <div className="w-20 h-10 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                  dot={false}
                />
                <RechartTooltip
                  contentStyle={{ display: "none" }}
                  cursor={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {change > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          ) : change < 0 ? (
            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span
            className={cn("text-xs font-medium", {
              "text-green-500": change > 0,
              "text-destructive": change < 0,
              "text-muted-foreground": change === 0,
            })}
          >
            {change > 0 ? "+" : ""}{change.toFixed(1)}% {changePeriod}
          </span>
        </div>
      )}

      {/* Health insight on hover */}
      {healthNote && healthStatus && healthStatus !== "good" && (
        <div className={cn("text-xs px-2 py-1.5 rounded-lg", healthColors[healthStatus])}>
          {healthNote}
        </div>
      )}
    </div>
  );
}

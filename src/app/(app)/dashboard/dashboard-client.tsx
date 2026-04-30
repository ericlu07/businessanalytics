"use client";

import { KpiTile } from "@/components/dashboard/kpi-tile";
import { ChartWidget } from "@/components/dashboard/chart-widget";
import { GoalProgressWidget } from "@/components/dashboard/goal-progress-widget";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getMetricByKey } from "@/lib/metrics/library";

type Period = "today" | "week" | "month" | "year";

interface DashboardClientProps {
  dashboard: {
    id: string;
    name: string;
    widgets: {
      id: string;
      type: string;
      title: string;
      metricId: string | null;
      config: Record<string, unknown>;
      gridW: number;
      gridH: number;
      metric: {
        id: string;
        name: string;
        builtInKey: string | null;
        prefix: string | null;
        unit: string | null;
      } | null;
    }[];
  };
  recentData: {
    metricId: string;
    value: number;
    recordedAt: string;
  }[];
  goals: {
    id: string;
    title: string;
    targetValue: number;
    metricId: string;
    metric: { name: string; prefix: string | null; unit: string | null };
  }[];
  userName?: string | null;
}

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
};

function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const first = name?.split(" ")[0] ?? "";
  if (hour < 12) return `Good morning${first ? ", " + first : ""} ☀️`;
  if (hour < 17) return `Good afternoon${first ? ", " + first : ""} 👋`;
  return `Good evening${first ? ", " + first : ""} 🌙`;
}

export function DashboardClient({ dashboard, recentData, goals, userName }: DashboardClientProps) {
  const [period, setPeriod] = useState<Period>("month");

  const dataByMetric = useMemo(() => {
    const map: Record<string, { v: number; date: string }[]> = {};
    for (const dp of recentData) {
      if (!map[dp.metricId]) map[dp.metricId] = [];
      map[dp.metricId]?.push({ v: dp.value, date: dp.recordedAt });
    }
    return map;
  }, [recentData]);

  function getLatestValue(metricId: string) {
    const pts = dataByMetric[metricId];
    if (!pts || pts.length === 0) return null;
    return pts[pts.length - 1]?.v ?? null;
  }

  function getChange(metricId: string) {
    const pts = dataByMetric[metricId];
    if (!pts || pts.length < 2) return undefined;
    const current = pts[pts.length - 1]?.v ?? 0;
    const previous = pts[pts.length - 2]?.v ?? 0;
    if (previous === 0) return undefined;
    return ((current - previous) / previous) * 100;
  }

  function getSparkline(metricId: string) {
    const pts = dataByMetric[metricId];
    if (!pts || pts.length < 2) return undefined;
    return pts.slice(-8).map((p) => ({ v: p.v }));
  }

  const hasWidgets = dashboard.widgets.length > 0;
  const kpiWidgets = dashboard.widgets.filter((w) => w.type === "KPI_TILE");
  const chartWidgets = dashboard.widgets.filter((w) =>
    ["LINE_CHART", "BAR_CHART", "DONUT_CHART"].includes(w.type)
  );
  const goalWidgets = dashboard.widgets.filter((w) => w.type === "GOAL_PROGRESS");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-700 text-2xl">{getGreeting(userName)}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(["today", "week", "month", "year"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md font-medium transition-colors",
                  period === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
          <Link href="/metrics">
            <Button size="sm" variant="outline" className="gap-1.5 h-8">
              <PlusCircle className="w-3.5 h-3.5" />
              Add widget
            </Button>
          </Link>
        </div>
      </div>

      {!hasWidgets ? (
        <EmptyDashboard dashboardId={dashboard.id} />
      ) : (
        <div className="space-y-6">
          {/* KPI tiles grid */}
          {kpiWidgets.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {kpiWidgets.map((widget) => {
                const metricId = widget.metricId;
                const def = widget.metric?.builtInKey ? getMetricByKey(widget.metric.builtInKey) : null;
                const latestValue = metricId ? getLatestValue(metricId) : null;
                const change = metricId ? getChange(metricId) : undefined;
                const sparkline = metricId ? getSparkline(metricId) : undefined;

                let healthStatus: "good" | "warning" | "bad" | null = null;
                if (def && latestValue !== null) {
                  if (def.healthLow !== undefined && def.healthHigh !== undefined) {
                    healthStatus = latestValue >= def.healthLow && latestValue <= def.healthHigh ? "good" : latestValue < def.healthLow ? "bad" : "warning";
                  } else if (def.healthHigh !== undefined) {
                    healthStatus = latestValue <= def.healthHigh ? "good" : "bad";
                  } else if (def.healthLow !== undefined) {
                    healthStatus = latestValue >= def.healthLow ? "good" : "warning";
                  }
                }

                return (
                  <div key={widget.id} className={cn(widget.gridW >= 2 ? "col-span-2" : "")}>
                    <KpiTile
                      title={widget.title}
                      value={latestValue ?? "—"}
                      prefix={widget.metric?.prefix ?? ""}
                      suffix={widget.metric?.unit ? ` ${widget.metric.unit}` : ""}
                      change={change}
                      sparklineData={sparkline}
                      healthStatus={healthStatus}
                      healthNote={def?.healthNote}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Chart widgets */}
          {chartWidgets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {chartWidgets.map((widget) => {
                const metricId = widget.metricId;
                const chartData = metricId
                  ? (dataByMetric[metricId] ?? []).map((p) => ({
                      name: format(new Date(p.date), "MMM d"),
                      value: p.v,
                    }))
                  : [];

                return (
                  <ChartWidget
                    key={widget.id}
                    title={widget.title}
                    type={
                      widget.type === "LINE_CHART"
                        ? "line"
                        : widget.type === "BAR_CHART"
                        ? "bar"
                        : "donut"
                    }
                    data={chartData}
                    prefix={widget.metric?.prefix ?? ""}
                    suffix={widget.metric?.unit ? ` ${widget.metric.unit}` : ""}
                  />
                );
              })}
            </div>
          )}

          {/* Goals section */}
          {goals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-600 text-base">Active Goals</h2>
                <Link href="/goals">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal) => {
                  const current = getLatestValue(goal.metricId) ?? 0;
                  return (
                    <GoalProgressWidget
                      key={goal.id}
                      title={goal.title}
                      current={current}
                      target={goal.targetValue}
                      prefix={goal.metric?.prefix ?? ""}
                      suffix={goal.metric?.unit ? ` ${goal.metric.unit}` : ""}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Goal progress widgets from dashboard */}
          {goalWidgets.length > 0 && goals.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalWidgets.map((widget) => (
                <GoalProgressWidget
                  key={widget.id}
                  title={widget.title}
                  current={0}
                  target={100}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

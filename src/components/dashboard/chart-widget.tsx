"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ChartWidgetProps {
  title: string;
  type: "line" | "bar" | "donut";
  data: { name: string; value: number; [key: string]: unknown }[];
  dataKey?: string;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
  className?: string;
}

export function ChartWidget({
  title,
  type,
  data,
  dataKey = "value",
  prefix = "",
  suffix = "",
  isLoading,
  className,
}: ChartWidgetProps) {
  if (isLoading) {
    return (
      <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
        <div className="animate-shimmer h-4 w-32 rounded mb-4" />
        <div className="animate-shimmer h-40 rounded" />
      </div>
    );
  }

  const formatValue = (v: unknown) => `${prefix}${Number(v).toLocaleString()}${suffix}`;

  return (
    <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
      <p className="text-sm font-heading font-600 mb-4">{title}</p>

      {type === "line" && (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${prefix}${v}`} />
            <Tooltip
              formatter={(v: unknown) => [formatValue(v), title]}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {type === "bar" && (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${prefix}${v}`} />
            <Tooltip
              formatter={(v: unknown) => [formatValue(v), title]}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {type === "donut" && (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey={dataKey}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: unknown) => [formatValue(v)]}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

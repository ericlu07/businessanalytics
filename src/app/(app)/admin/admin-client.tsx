"use client";

import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, Database, TrendingUp, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface AdminClientProps {
  stats: {
    totalUsers: number;
    newUsersToday: number;
    newUsersWeek: number;
    totalMetrics: number;
    totalDataPoints: number;
  };
  planCounts: { subscriptionPlan: string; _count: { id: number } }[];
  recentUsers: {
    id: string;
    email: string;
    name: string | null;
    subscriptionPlan: string;
    createdAt: string;
    businessType: string | null;
  }[];
}

const planColors: Record<string, string> = {
  FREE: "bg-secondary text-secondary-foreground",
  SOLO: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PRO: "bg-primary/15 text-primary",
  TEAM: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export function AdminClient({ stats, planCounts, recentUsers }: AdminClientProps) {
  const kpis = [
    { label: "Total users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "New today", value: `+${stats.newUsersToday}`, icon: UserPlus, color: "text-green-500" },
    { label: "New this week", value: `+${stats.newUsersWeek}`, icon: TrendingUp, color: "text-blue-500" },
    { label: "Total metrics", value: stats.totalMetrics.toLocaleString(), icon: BarChart3, color: "text-amber-500" },
    { label: "Data points", value: stats.totalDataPoints.toLocaleString(), icon: Database, color: "text-purple-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading font-700 text-2xl">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and user management.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="font-heading font-700 text-2xl">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Plan distribution */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-heading font-600 text-base mb-4">Plan distribution</h2>
        <div className="flex flex-wrap gap-4">
          {planCounts.map((pc) => (
            <div key={pc.subscriptionPlan} className="flex items-center gap-2">
              <Badge className={planColors[pc.subscriptionPlan] ?? planColors["FREE"]}>
                {pc.subscriptionPlan}
              </Badge>
              <span className="font-heading font-600">{pc._count.id}</span>
              <span className="text-muted-foreground text-sm">
                ({((pc._count.id / stats.totalUsers) * 100).toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent users */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-heading font-600 text-base">Recent users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Business type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-sm font-medium">{user.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge className={planColors[user.subscriptionPlan] ?? planColors["FREE"]}>
                      {user.subscriptionPlan}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {user.businessType ?? "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

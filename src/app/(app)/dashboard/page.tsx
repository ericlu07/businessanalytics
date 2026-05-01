import { requireUserProfile, isDemoMode } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { DashboardClient } from "./dashboard-client";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

// ---------------------------------------------------------------------------
// Demo data — shown when DEMO_MODE=true
// ---------------------------------------------------------------------------
const DEMO_DASHBOARD = {
  id: "demo-dash",
  name: "My Dashboard",
  widgets: [
    { id: "w1", type: "KPI_TILE", title: "Monthly Revenue", metricId: "m1", config: {}, position: 0, gridX: 0, gridY: 0, gridW: 2, gridH: 1,
      metric: { id: "m1", name: "Monthly Revenue", prefix: "$", unit: null, color: null, icon: null, targetValue: 10000, alertLow: null, alertHigh: null, builtInKey: "monthly_revenue", category: "FINANCIAL" } },
    { id: "w2", type: "KPI_TILE", title: "New Customers", metricId: "m2", config: {}, position: 1, gridX: 2, gridY: 0, gridW: 2, gridH: 1,
      metric: { id: "m2", name: "New Customers", prefix: null, unit: "customers", color: null, icon: null, targetValue: 50, alertLow: null, alertHigh: null, builtInKey: "new_customers", category: "SALES" } },
    { id: "w3", type: "KPI_TILE", title: "MRR", metricId: "m3", config: {}, position: 2, gridX: 4, gridY: 0, gridW: 2, gridH: 1,
      metric: { id: "m3", name: "MRR", prefix: "$", unit: null, color: null, icon: null, targetValue: 8000, alertLow: null, alertHigh: null, builtInKey: "mrr", category: "FINANCIAL" } },
    { id: "w4", type: "LINE_CHART", title: "Revenue (6 months)", metricId: "m1", config: {}, position: 3, gridX: 0, gridY: 1, gridW: 4, gridH: 2,
      metric: { id: "m1", name: "Monthly Revenue", prefix: "$", unit: null, color: null, icon: null, targetValue: 10000, alertLow: null, alertHigh: null, builtInKey: "monthly_revenue", category: "FINANCIAL" } },
    { id: "w5", type: "GOAL_PROGRESS", title: "Revenue Goal", metricId: "m1", config: {}, position: 4, gridX: 4, gridY: 1, gridW: 2, gridH: 2,
      metric: { id: "m1", name: "Monthly Revenue", prefix: "$", unit: null, color: null, icon: null, targetValue: 10000, alertLow: null, alertHigh: null, builtInKey: "monthly_revenue", category: "FINANCIAL" } },
  ],
};

const DEMO_RECENT_DATA = [
  { id: "d1", metricId: "m1", value: 4200, recordedAt: new Date("2024-11-01"), userId: "demo" },
  { id: "d2", metricId: "m1", value: 5100, recordedAt: new Date("2024-12-01"), userId: "demo" },
  { id: "d3", metricId: "m1", value: 6300, recordedAt: new Date("2025-01-01"), userId: "demo" },
  { id: "d4", metricId: "m1", value: 7200, recordedAt: new Date("2025-02-01"), userId: "demo" },
  { id: "d5", metricId: "m1", value: 8100, recordedAt: new Date("2025-03-01"), userId: "demo" },
  { id: "d6", metricId: "m1", value: 9400, recordedAt: new Date("2025-04-01"), userId: "demo" },
  { id: "d7", metricId: "m2", value: 12, recordedAt: new Date("2024-11-01"), userId: "demo" },
  { id: "d8", metricId: "m2", value: 18, recordedAt: new Date("2024-12-01"), userId: "demo" },
  { id: "d9", metricId: "m2", value: 24, recordedAt: new Date("2025-01-01"), userId: "demo" },
  { id: "d10", metricId: "m2", value: 31, recordedAt: new Date("2025-02-01"), userId: "demo" },
  { id: "d11", metricId: "m2", value: 38, recordedAt: new Date("2025-03-01"), userId: "demo" },
  { id: "d12", metricId: "m2", value: 42, recordedAt: new Date("2025-04-01"), userId: "demo" },
  { id: "d13", metricId: "m3", value: 3200, recordedAt: new Date("2024-11-01"), userId: "demo" },
  { id: "d14", metricId: "m3", value: 4100, recordedAt: new Date("2024-12-01"), userId: "demo" },
  { id: "d15", metricId: "m3", value: 5200, recordedAt: new Date("2025-01-01"), userId: "demo" },
  { id: "d16", metricId: "m3", value: 5900, recordedAt: new Date("2025-02-01"), userId: "demo" },
  { id: "d17", metricId: "m3", value: 6800, recordedAt: new Date("2025-03-01"), userId: "demo" },
  { id: "d18", metricId: "m3", value: 7400, recordedAt: new Date("2025-04-01"), userId: "demo" },
];

const DEMO_GOALS = [
  {
    id: "g1", title: "Hit $10k MRR", targetValue: 10000, startValue: 3200,
    status: "ACTIVE", deadline: new Date("2025-06-30"), metricId: "m1",
    metric: { id: "m1", name: "Monthly Revenue", prefix: "$", unit: null },
  },
  {
    id: "g2", title: "50 new customers/month", targetValue: 50, startValue: 12,
    status: "ACTIVE", deadline: new Date("2025-06-30"), metricId: "m2",
    metric: { id: "m2", name: "New Customers", prefix: null, unit: "customers" },
  },
];

export default async function DashboardPage() {
  const { profile } = await requireUserProfile();

  // Demo mode — skip all DB calls
  if (isDemoMode()) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Dashboard" }]} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DashboardClient
            dashboard={JSON.parse(JSON.stringify(DEMO_DASHBOARD))}
            recentData={JSON.parse(JSON.stringify(DEMO_RECENT_DATA))}
            goals={JSON.parse(JSON.stringify(DEMO_GOALS))}
            userName={profile.name}
          />
        </main>
      </div>
    );
  }

  // Real DB path
  if (!profile.onboardingComplete) redirect("/onboarding");

  let dashboard = await db.dashboard.findFirst({
    where: { userId: profile.id, isDefault: true },
    include: { widgets: { include: { metric: true }, orderBy: { position: "asc" } } },
  });

  if (!dashboard) {
    dashboard = await db.dashboard.create({
      data: { userId: profile.id, name: "My Dashboard", isDefault: true },
      include: { widgets: { include: { metric: true }, orderBy: { position: "asc" } } },
    });
  }

  const metricIds = dashboard.widgets.map((w) => w.metricId).filter(Boolean) as string[];
  const recentData = metricIds.length > 0
    ? await db.dataPoint.findMany({
        where: { userId: profile.id, metricId: { in: metricIds } },
        orderBy: { recordedAt: "asc" },
        take: 100,
      })
    : [];

  const goals = await db.goal.findMany({
    where: { userId: profile.id, status: "ACTIVE" },
    include: { metric: true },
    take: 5,
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: dashboard.name }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <DashboardClient
          dashboard={JSON.parse(JSON.stringify(dashboard))}
          recentData={JSON.parse(JSON.stringify(recentData))}
          goals={JSON.parse(JSON.stringify(goals))}
          userName={profile.name}
        />
      </main>
    </div>
  );
}

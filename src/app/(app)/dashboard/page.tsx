import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { DashboardClient } from "./dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { profile } = await requireUserProfile();

  // Get or create default dashboard
  let dashboard = await db.dashboard.findFirst({
    where: { userId: profile.id, isDefault: true },
    include: {
      widgets: {
        include: { metric: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!dashboard) {
    dashboard = await db.dashboard.create({
      data: {
        userId: profile.id,
        name: "My Dashboard",
        isDefault: true,
      },
      include: {
        widgets: {
          include: { metric: true },
          orderBy: { position: "asc" },
        },
      },
    });
  }

  // Recent data points for sparklines (last 7 data points per metric)
  const metricIds = dashboard.widgets.map((w) => w.metricId).filter(Boolean) as string[];

  const recentData = metricIds.length > 0
    ? await db.dataPoint.findMany({
        where: { userId: profile.id, metricId: { in: metricIds } },
        orderBy: { recordedAt: "asc" },
        take: 100,
      })
    : [];

  // Active goals
  const goals = await db.goal.findMany({
    where: { userId: profile.id, status: "ACTIVE" },
    include: { metric: true },
    take: 5,
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: dashboard.name },
        ]}
      />
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

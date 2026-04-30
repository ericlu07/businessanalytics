import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { AdminClient } from "./admin-client";
import { subDays, startOfDay } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  await requireAdmin();

  const [totalUsers, newUsersToday, newUsersWeek, planCounts, recentUsers] = await Promise.all([
    db.user.count({ where: { deletedAt: null } }),
    db.user.count({ where: { createdAt: { gte: startOfDay(new Date()) } } }),
    db.user.count({ where: { createdAt: { gte: subDays(new Date(), 7) } } }),
    db.user.groupBy({ by: ["subscriptionPlan"], _count: { id: true } }),
    db.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, email: true, name: true, subscriptionPlan: true, createdAt: true, businessType: true },
    }),
  ]);

  const totalMetrics = await db.metric.count();
  const totalDataPoints = await db.dataPoint.count();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Admin" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AdminClient
          stats={{ totalUsers, newUsersToday, newUsersWeek, totalMetrics, totalDataPoints }}
          planCounts={planCounts}
          recentUsers={JSON.parse(JSON.stringify(recentUsers))}
        />
      </main>
    </div>
  );
}

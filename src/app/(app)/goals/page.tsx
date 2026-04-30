import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { GoalsClient } from "./goals-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Goals" };

export default async function GoalsPage() {
  const { profile } = await requireUserProfile();

  const goals = await db.goal.findMany({
    where: { userId: profile.id },
    include: { metric: true },
    orderBy: { createdAt: "desc" },
  });

  const metrics = await db.metric.findMany({
    where: { userId: profile.id },
    orderBy: { name: "asc" },
  });

  // Latest value per metric for progress
  const metricIds = [...new Set(goals.map((g) => g.metricId))];
  const latestData: Record<string, number> = {};
  for (const mId of metricIds) {
    const latest = await db.dataPoint.findFirst({
      where: { metricId: mId, userId: profile.id },
      orderBy: { recordedAt: "desc" },
    });
    if (latest) latestData[mId] = latest.value;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Goals" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <GoalsClient
          goals={JSON.parse(JSON.stringify(goals))}
          metrics={JSON.parse(JSON.stringify(metrics))}
          latestData={latestData}
        />
      </main>
    </div>
  );
}

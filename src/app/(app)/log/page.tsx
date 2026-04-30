import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { LogClient } from "./log-client";
import type { Metadata } from "next";
import { startOfMonth } from "date-fns";

export const metadata: Metadata = { title: "Log Data" };

export default async function LogPage() {
  const { profile } = await requireUserProfile();

  const metrics = await db.metric.findMany({
    where: { userId: profile.id },
    orderBy: { name: "asc" },
  });

  const recentPoints = await db.dataPoint.findMany({
    where: { userId: profile.id, recordedAt: { gte: startOfMonth(new Date()) } },
    include: { metric: true },
    orderBy: { recordedAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Log Data" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <LogClient
          metrics={JSON.parse(JSON.stringify(metrics))}
          recentPoints={JSON.parse(JSON.stringify(recentPoints))}
        />
      </main>
    </div>
  );
}

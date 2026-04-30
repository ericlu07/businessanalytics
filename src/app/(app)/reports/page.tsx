import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { ReportsClient } from "./reports-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const { profile } = await requireUserProfile();

  const reports = await db.report.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  const metrics = await db.metric.findMany({
    where: { userId: profile.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Reports" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <ReportsClient
          reports={JSON.parse(JSON.stringify(reports))}
          metrics={JSON.parse(JSON.stringify(metrics))}
        />
      </main>
    </div>
  );
}

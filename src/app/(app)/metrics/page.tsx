import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { MetricsClient } from "./metrics-client";
import { METRIC_LIBRARY, CATEGORY_LABELS } from "@/lib/metrics/library";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Metric Library" };

export default async function MetricsPage() {
  const { profile } = await requireUserProfile();

  const userMetrics = await db.metric.findMany({
    where: { userId: profile.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Metric Library" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <MetricsClient
          builtInMetrics={METRIC_LIBRARY}
          userMetrics={JSON.parse(JSON.stringify(userMetrics))}
          categoryLabels={CATEGORY_LABELS}
          businessType={profile.businessType ?? "CUSTOM"}
        />
      </main>
    </div>
  );
}

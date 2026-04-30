import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { TimeTrackerClient } from "./time-client";
import type { Metadata } from "next";
import { startOfMonth, endOfMonth } from "date-fns";

export const metadata: Metadata = { title: "Time Tracker" };

export default async function TimePage() {
  const { profile } = await requireUserProfile();

  const now = new Date();
  const entries = await db.timeEntry.findMany({
    where: {
      userId: profile.id,
      startedAt: { gte: startOfMonth(now), lte: endOfMonth(now) },
    },
    orderBy: { startedAt: "desc" },
  });

  const running = await db.timeEntry.findFirst({
    where: { userId: profile.id, status: "RUNNING" },
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Time Tracker" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <TimeTrackerClient
          entries={JSON.parse(JSON.stringify(entries))}
          runningEntry={running ? JSON.parse(JSON.stringify(running)) : null}
        />
      </main>
    </div>
  );
}

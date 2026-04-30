import { requireUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Topbar } from "@/components/app/topbar";
import { NotificationsClient } from "./notifications-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const { profile } = await requireUserProfile();

  const notifications = await db.notification.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Notifications" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <NotificationsClient notifications={JSON.parse(JSON.stringify(notifications))} />
      </main>
    </div>
  );
}

import { requireUserProfile } from "@/lib/auth";
import { Sidebar } from "@/components/app/sidebar";
import { db } from "@/lib/db";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUserProfile();

  const unreadCount = await db.notification.count({
    where: { userId: profile.id, readAt: null },
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        unreadCount={unreadCount}
        user={{
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
        }}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}

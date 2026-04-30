"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Target, TrendingUp, Info } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

interface NotificationsClientProps {
  notifications: Notification[];
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  GOAL_REACHED: Target,
  GOAL_MILESTONE: Target,
  METRIC_ALERT: TrendingUp,
  WEEKLY_DIGEST: Bell,
  SYSTEM: Info,
};

export function NotificationsClient({ notifications }: NotificationsClientProps) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.readAt);

  async function markAllRead() {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setItems((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
      toast.success("All marked as read");
    } catch { toast.error("Failed to mark as read"); }
  }

  async function markRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch { toast.error("Failed to mark as read"); }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading font-700 text-2xl mb-8">Notifications</h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading font-600 text-xl mb-2">All caught up</h2>
          <p className="text-muted-foreground text-sm">No notifications yet. We&apos;ll alert you when goals are hit or metrics need attention.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-700 text-2xl">Notifications</h1>
          {unread.length > 0 && (
            <p className="text-muted-foreground text-sm mt-1">{unread.length} unread</p>
          )}
        </div>
        {unread.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((n, i) => {
          const Icon = typeIcons[n.type] ?? Bell;
          const unreadItem = !n.readAt;
          return (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => { if (unreadItem) markRead(n.id); }}
              className={cn(
                "w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-colors",
                unreadItem
                  ? "bg-primary/5 border-primary/20 hover:bg-primary/8"
                  : "bg-card border-border hover:bg-muted/50"
              )}
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", unreadItem ? "bg-primary/15" : "bg-muted")}>
                <Icon className={cn("w-4 h-4", unreadItem ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={cn("text-sm font-medium", !unreadItem && "text-muted-foreground")}>{n.title}</p>
                  {unreadItem && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{n.body}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

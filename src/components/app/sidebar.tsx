"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  LayoutDashboard,
  BookOpen,
  Target,
  Clock,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  HelpCircle,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { UserMenu } from "./user-menu";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/metrics", icon: BookOpen, label: "Metrics" },
  { href: "/log", icon: Plus, label: "Log Data" },
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/time", icon: Clock, label: "Time Tracker" },
  { href: "/reports", icon: FileText, label: "Reports" },
];

const bottomItems = [
  { href: "/notifications", icon: Bell, label: "Notifications", badge: true },
  { href: "/help", icon: HelpCircle, label: "Help" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  unreadCount?: number;
  user?: { name?: string | null; email?: string | null; avatarUrl?: string | null };
}

export function Sidebar({ unreadCount = 0, user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider delay={0}>
      <aside
        className={cn(
          "relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out bg-sidebar",
          collapsed ? "w-16" : "w-60"
        )}
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 py-5 border-b", collapsed && "justify-center px-2")}
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading font-semibold text-sidebar-foreground">Pulse</span>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full border bg-background flex items-center justify-center hover:bg-muted transition-colors z-10 shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* New dashboard button */}
        {!collapsed && (
          <div className="px-3 pt-4">
            <Link href="/dashboard/new">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-sidebar-foreground border-sidebar-border bg-sidebar hover:bg-sidebar-accent"
              >
                <PlusCircle className="w-4 h-4" />
                New dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Main nav */}
        <nav className={cn("flex-1 px-3 py-4 space-y-1 overflow-y-auto", collapsed && "px-2")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");

            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active && "text-primary")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger render={link} />
                  <TooltipContent side="right" className="ml-1">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>

        {/* Bottom nav */}
        <div className={cn("border-t px-3 py-3 space-y-1", collapsed && "px-2")}
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {item.badge && unreadCount > 0 && (
                  <Badge className="ml-auto bg-primary text-primary-foreground text-xs py-0 px-1.5 min-w-[1.25rem] h-5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger render={link} />
                  <TooltipContent side="right" className="ml-1">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}

          {/* User menu */}
          <div className={cn("pt-2 border-t mt-2", collapsed && "flex justify-center")}
            style={{ borderColor: "var(--sidebar-border)" }}
          >
            <UserMenu user={user} collapsed={collapsed} />
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

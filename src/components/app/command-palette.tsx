"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Clock,
  FileText,
  Settings,
  Plus,
  LogOut,
  HelpCircle,
  Bell,
} from "lucide-react";

const pages = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigate" },
  { label: "Metric Library", href: "/metrics", icon: BookOpen, group: "Navigate" },
  { label: "Goals", href: "/goals", icon: Target, group: "Navigate" },
  { label: "Time Tracker", href: "/time", icon: Clock, group: "Navigate" },
  { label: "Reports", href: "/reports", icon: FileText, group: "Navigate" },
  { label: "Notifications", href: "/notifications", icon: Bell, group: "Navigate" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Navigate" },
  { label: "Help Center", href: "/help", icon: HelpCircle, group: "Navigate" },
  { label: "Log a data point", href: "/log", icon: Plus, group: "Actions" },
  { label: "New dashboard", href: "/dashboard/new", icon: Plus, group: "Actions" },
  { label: "New goal", href: "/goals/new", icon: Target, group: "Actions" },
  { label: "Start timer", href: "/time?start=1", icon: Clock, group: "Actions" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  async function handleSignOut() {
    onOpenChange(false);
    await supabase.auth.signOut();
    router.push("/login");
  }

  const groups = [...new Set(pages.map((p) => p.group))];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions, metrics..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, i) => (
          <div key={group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {pages
                .filter((p) => p.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.href}
                      value={item.label}
                      onSelect={() => handleSelect(item.href)}
                      className="cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </div>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem value="sign out" onSelect={handleSignOut} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

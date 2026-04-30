"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, CreditCard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user?: { name?: string | null; email?: string | null; avatarUrl?: string | null };
  collapsed?: boolean;
}

export function UserMenu({ user, collapsed }: UserMenuProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors",
              collapsed && "justify-center w-10 h-10"
            )}
            aria-label="User menu"
          />
        }
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-primary">{initials}</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
              {user?.name ?? "Account"}
            </p>
            <p className="text-xs text-sidebar-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-52" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold truncate">{user?.name ?? "Account"}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<a href="/settings/profile" className="cursor-pointer" />}>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href="/settings/billing" className="cursor-pointer" />}>
          <CreditCard className="w-4 h-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href="/settings" className="cursor-pointer" />}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CommandPalette } from "./command-palette";
import { useState } from "react";

interface TopbarProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  unreadCount?: number;
}

export function Topbar({ title, breadcrumbs, unreadCount = 0 }: TopbarProps) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-1 text-sm min-w-0">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1 min-w-0">
                  {i > 0 && <span className="text-muted-foreground/40">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors truncate">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium truncate">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : title ? (
            <h1 className="font-heading font-semibold text-base">{title}</h1>
          ) : null}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search / Command palette trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCmdOpen(true)}
            className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs h-8 px-3 w-48 justify-start"
          >
            <Search className="w-3.5 h-3.5" />
            Search anything...
            <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCmdOpen(true)}
            className="sm:hidden h-8 w-8"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

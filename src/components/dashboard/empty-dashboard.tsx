"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, PlusCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function EmptyDashboard({ dashboardId }: { dashboardId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <BarChart3 className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <PlusCircle className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      <h2 className="font-heading font-700 text-2xl mb-3">Your dashboard is empty</h2>
      <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
        Add metric widgets to start tracking your business. Browse the library to find the KPIs that matter most for your business type.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/metrics">
          <Button className="gap-2">
            <BookOpen className="w-4 h-4" />
            Browse metric library
          </Button>
        </Link>
        <Link href="/log">
          <Button variant="outline" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Log your first data point
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Tip: Press <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border font-mono text-xs">⌘K</kbd> to search for anything
      </p>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, TrendingUp, Target, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const statsCards = [
  { label: "Monthly Revenue", value: "$12,480", change: "+18%", color: "text-green-500", icon: TrendingUp },
  { label: "Active Clients", value: "24", change: "+3 this month", color: "text-blue-500", icon: BarChart3 },
  { label: "Goal Progress", value: "84%", change: "Monthly target", color: "text-primary", icon: Target },
  { label: "Billable Hours", value: "142h", change: "$88/hr avg", color: "text-amber-500", icon: Clock },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-aurora" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-aurora" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 text-primary bg-primary/8">
            <Zap className="w-3 h-3" />
            Built for solopreneurs & small businesses
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-800 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.05]"
        >
          Your business,{" "}
          <span className="gradient-text">finally visible.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Replace the Google Sheets chaos with a beautiful, customizable analytics dashboard.
          Track revenue, clients, goals, and time — all in one place. Set up in 5 minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link href="/register">
            <Button size="lg" className="gap-2 px-8 text-base glow-sm h-12">
              Start free — no card required
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/#features">
            <Button variant="outline" size="lg" className="gap-2 px-8 text-base h-12">
              See how it works
            </Button>
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="text-sm text-muted-foreground mb-16"
        >
          Join 2,400+ solopreneurs tracking their business with Pulse ·{" "}
          <span className="text-foreground font-medium">Free forever plan available</span>
        </motion.p>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Browser bar */}
            <div className="bg-muted/60 px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
              </div>
              <div className="flex-1 mx-4 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                app.usepulse.com/dashboard
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-background p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Good morning,</p>
                  <h2 className="font-heading font-semibold text-lg">Business Overview</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">This month</Badge>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">JD</span>
                  </div>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">{card.label}</span>
                        <Icon className={`w-4 h-4 ${card.color}`} />
                      </div>
                      <p className="font-heading font-700 text-xl text-foreground">{card.value}</p>
                      <p className={`text-xs mt-1 ${card.color}`}>{card.change}</p>
                    </div>
                  );
                })}
              </div>

              {/* Chart placeholder */}
              <div className="bg-card border border-border rounded-xl p-4 h-32 flex items-end gap-1 overflow-hidden">
                {[45, 62, 48, 71, 58, 85, 72, 91, 68, 78, 95, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Glow beneath */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/20 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}

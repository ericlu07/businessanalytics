import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Target, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Pulse",
  description: "The story behind Pulse — built for small business owners who are done with spreadsheets.",
};

const values = [
  {
    icon: Target,
    title: "Built for builders",
    description: "Every feature in Pulse was designed around the real needs of freelancers, side hustlers, and small business owners — not enterprise teams.",
  },
  {
    icon: Zap,
    title: "Fast & focused",
    description: "No bloat. No 47-tab onboarding. Pulse gets out of your way so you can focus on growing your business.",
  },
  {
    icon: Heart,
    title: "Made with care",
    description: "We obsess over the details — from the keyboard shortcuts to the way your data is visualised. Small things add up.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          <Activity className="w-4 h-4" />
          Our story
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
          Built by a side hustler,<br />for side hustlers.
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Pulse started as a personal spreadsheet. Tracking revenue, hours, client counts — all in a Google Sheet that got messier every month. We figured if we needed this, thousands of other small business owners did too.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 space-y-3">
        <h2 className="font-heading text-xl font-semibold">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          Give every small business owner the same clarity that Fortune 500 companies have — without the enterprise price tag or the learning curve. Your business deserves a proper dashboard.
        </p>
      </div>

      {/* Values */}
      <div className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold">What we believe</h2>
        <div className="space-y-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="font-heading text-2xl font-semibold">Ready to get started?</h2>
        <p className="text-muted-foreground">Free forever for solo founders. No credit card required.</p>
        <div className="flex gap-3 justify-center">
          <Button render={<Link href="/register" />} size="lg">
            Start for free
          </Button>
          <Button render={<Link href="/contact" />} variant="outline" size="lg">
            Get in touch
          </Button>
        </div>
      </div>
    </div>
  );
}

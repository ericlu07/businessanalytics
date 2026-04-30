"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Target,
  Clock,
  FileText,
  Plug,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Drag-drop dashboard",
    description:
      "Build your perfect analytics view. Drag, resize, and arrange metric widgets exactly how you think. Save multiple dashboards for different contexts.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: SlidersHorizontal,
    title: "Business type templates",
    description:
      "Pick Freelancer, Ecommerce, SaaS, or Creator — get a pre-configured dashboard with the metrics that actually matter for your business.",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Target,
    title: "Goals & milestones",
    description:
      "Set revenue targets, client goals, or any custom metric. See real-time progress bars and get notified the moment you hit a milestone.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Clock,
    title: "Built-in time tracker",
    description:
      "Log hours by project or client. Pulse automatically calculates your effective hourly rate so you always know if you're charging enough.",
    color: "text-green-500 bg-green-500/10",
  },
  {
    icon: FileText,
    title: "One-click reports",
    description:
      "Generate beautiful PDF reports for yourself, investors, or clients. Monthly summaries, income statements, and project breakdowns — done in seconds.",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "60+ pre-built metrics",
    description:
      "A full library of business metrics: MRR, CAC, LTV, profit margin, and more. Add any to your dashboard with one click, with plain-English explanations.",
    color: "text-red-500 bg-red-500/10",
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "Connect Stripe, PayPal, Google Sheets, and Shopify to sync data automatically. No more manual entry, no more stale spreadsheets.",
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    icon: Sparkles,
    title: "Metric insights",
    description:
      '"Your profit margin is 15%, below the healthy 20–40% range. Common causes: underpricing, rising expenses." Every number has a plain-English explanation.',
    color: "text-pink-500 bg-pink-500/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary mb-3 uppercase tracking-wider"
          >
            Everything you need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-heading text-4xl md:text-5xl font-700 tracking-tight mb-4"
          >
            Replace 5 tools with one.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything a solopreneur or small team needs to understand their business — in a single dashboard.
          </motion.p>
        </div>

        {/* Feature grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="group p-6 rounded-2xl border border-border bg-card card-hover"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-600 text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

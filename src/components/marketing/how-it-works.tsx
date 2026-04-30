"use client";

import { motion } from "framer-motion";
import { UserPlus, LayoutTemplate, BarChart3, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create your account",
    description: "Sign up free in 30 seconds. No credit card, no setup complexity. Just an email and a password.",
  },
  {
    step: "02",
    icon: LayoutTemplate,
    title: "Pick your template",
    description: "Choose your business type — Freelancer, Ecommerce, SaaS, Creator, or blank canvas. Your dashboard pre-populates.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Add your data",
    description: "Log revenue, clients, and hours manually or import from a CSV. Connect Stripe/PayPal for automatic sync.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Watch your business grow",
    description: "Set goals, track progress, get weekly digests. Know exactly what's working and what needs attention.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-heading text-4xl md:text-5xl font-700 tracking-tight mb-4"
          >
            Up and running in 5 minutes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-xl text-muted-foreground max-w-xl mx-auto"
          >
            No data engineering. No complex setup. No expert required.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-border -translate-y-1/2 z-0" style={{ width: "calc(100% - 2.5rem)", left: "2.5rem" }} />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-heading font-700 text-3xl text-muted-foreground/30">{step.step}</span>
                  </div>
                  <h3 className="font-heading font-600 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

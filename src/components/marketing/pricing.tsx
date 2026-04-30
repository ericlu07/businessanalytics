"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "For getting started",
    cta: "Start free",
    href: "/register",
    highlighted: false,
    features: [
      { text: "1 dashboard", included: true },
      { text: "5 metric widgets", included: true },
      { text: "3 months data history", included: true },
      { text: "Manual data entry", included: true },
      { text: "Goals & targets", included: false },
      { text: "Time tracker", included: false },
      { text: "Reports", included: false },
      { text: "Integrations", included: false },
    ],
  },
  {
    name: "Solo",
    monthlyPrice: 12,
    yearlyPrice: 9,
    description: "For serious solopreneurs",
    cta: "Start Solo",
    href: "/register?plan=solo",
    highlighted: false,
    features: [
      { text: "Unlimited widgets", included: true },
      { text: "2 dashboards", included: true },
      { text: "Full data history", included: true },
      { text: "Manual entry + CSV import", included: true },
      { text: "Goals & targets", included: true },
      { text: "Time tracker", included: true },
      { text: "PDF reports", included: true },
      { text: "Integrations", included: false },
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 22,
    description: "Everything, unlocked",
    cta: "Start Pro",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "Most popular",
    features: [
      { text: "Unlimited widgets + dashboards", included: true },
      { text: "Full data history", included: true },
      { text: "All data entry methods", included: true },
      { text: "Goals, targets & alerts", included: true },
      { text: "Time tracker", included: true },
      { text: "PDF + shareable reports", included: true },
      { text: "Stripe, PayPal, Shopify sync", included: true },
      { text: "Team sharing (up to 3)", included: true },
    ],
  },
  {
    name: "Team",
    monthlyPrice: 59,
    yearlyPrice: 45,
    description: "For growing teams",
    cta: "Start Team",
    href: "/register?plan=team",
    highlighted: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Up to 10 users", included: true },
      { text: "White-label reports", included: true },
      { text: "Admin dashboard", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: true },
      { text: "SSO (coming soon)", included: true },
      { text: "SLA available", included: true },
    ],
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-heading text-4xl md:text-5xl font-700 tracking-tight mb-4"
          >
            Pricing that scales with you.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-xl text-muted-foreground max-w-xl mx-auto mb-8"
          >
            Start free. Upgrade when you need more. Cancel anytime, no questions asked.
          </motion.p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2">
            <span className={cn("text-sm transition-colors", !annual ? "text-foreground font-medium" : "text-muted-foreground")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                annual ? "bg-primary" : "bg-muted"
              )}
              aria-label="Toggle annual billing"
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                  annual ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-sm transition-colors", annual ? "text-foreground font-medium" : "text-muted-foreground")}>
              Annual
              <Badge variant="secondary" className="ml-1.5 text-xs py-0">Save 24%</Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={cn(
                "relative rounded-2xl p-6 flex flex-col",
                plan.highlighted
                  ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-xl"
                  : "bg-card border border-border"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500 shadow-sm">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-heading font-600 text-lg mb-1">{plan.name}</h3>
                <p className={cn("text-sm", plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="font-heading font-700 text-4xl">
                    ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className={cn("text-sm mb-1.5", plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    /mo
                  </span>
                </div>
                {annual && plan.monthlyPrice > 0 && (
                  <p className={cn("text-xs", plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground")}>
                    <span className="line-through">${plan.monthlyPrice}/mo</span> billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <Check className={cn("w-4 h-4 mt-0.5 shrink-0", plan.highlighted ? "text-primary-foreground" : "text-primary")} />
                    ) : (
                      <X className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={cn(!f.included && !plan.highlighted && "text-muted-foreground/50")}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "secondary" : "default"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Need something custom?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Talk to us
          </Link>
        </p>
      </div>
    </section>
  );
}

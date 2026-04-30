"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {

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
            Free during beta — no credit card required, no limits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.14 }}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Open beta — all features free
            </Badge>
          </motion.div>
        </div>

        <div className="max-w-md mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-2xl p-8 flex flex-col bg-primary text-primary-foreground ring-2 ring-primary shadow-xl"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber-500 text-white hover:bg-amber-500 shadow-sm">
                Free beta
              </Badge>
            </div>

            <div className="mb-5">
              <h3 className="font-heading font-600 text-xl mb-1">Everything, free.</h3>
              <p className="text-sm text-primary-foreground/70">No credit card. No limits. No catch.</p>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-heading font-700 text-5xl">$0</span>
                <span className="text-sm mb-2 text-primary-foreground/70">/mo during beta</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                "Unlimited dashboards & widgets",
                "50+ built-in metrics",
                "Goals & targets",
                "Time tracker",
                "CSV import",
                "Reports",
                "Manual data entry",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button className="w-full" variant="secondary">
                Get started free
              </Button>
            </Link>
          </motion.div>
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

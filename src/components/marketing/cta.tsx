"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 bg-primary relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-heading text-4xl md:text-5xl font-700 tracking-tight text-primary-foreground mb-6"
        >
          Your business deserves better than a spreadsheet.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
        >
          Start free. No credit card. No setup complexity. See your business clearly from day one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 px-8 text-base h-12 bg-white text-primary hover:bg-white/90"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/help">
            <Button
              size="lg"
              variant="ghost"
              className="gap-2 px-8 text-base h-12 text-primary-foreground hover:bg-white/10"
            >
              Read the docs
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mt-8 text-sm text-primary-foreground/60"
        >
          Free plan available forever · Upgrade anytime · Cancel in one click
        </motion.p>
      </div>
    </section>
  );
}

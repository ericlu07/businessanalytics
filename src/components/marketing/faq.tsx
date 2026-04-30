"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Can I really replace Google Sheets with Pulse?",
    a: "Yes — for tracking business metrics. Pulse handles revenue, clients, expenses, goals, and time in a clean dashboard. If you also use Sheets for calculations or collaboration, you can import your data via CSV or connect it via our Google Sheets integration.",
  },
  {
    q: "Do I need technical skills to set up Pulse?",
    a: "None at all. Pick your business type, log your first metric, and you're done. No formulas, no data engineering, no 'figuring it out.' Most users are running in under 10 minutes.",
  },
  {
    q: "What happens when I hit the free plan limits?",
    a: "You'll see a gentle upgrade prompt when you try to add a 6th widget or a 2nd dashboard. Your existing data is never touched — you can always upgrade, downgrade, or export at any time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. Cancel from your billing settings in one click. You keep access until the end of your billing period.",
  },
  {
    q: "Is my business data secure?",
    a: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Supabase hosted on AWS with Row-Level Security so your data is never accessible by other users. We never sell your data to anyone.",
  },
  {
    q: "Does Pulse work for any kind of business?",
    a: "Yes. We have templates for freelancers, ecommerce, SaaS, creators, service businesses, and side hustles. You can also start blank and add exactly the metrics that matter for your specific situation.",
  },
  {
    q: "What integrations are available?",
    a: "Currently: Stripe, PayPal, Google Sheets (two-way sync), and Shopify. More coming based on user demand — vote on our public roadmap to prioritize what matters to you.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The free plan is free forever — that's your trial. Paid plans have a 14-day money-back guarantee, no questions asked.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-medium text-sm sm:text-base">{q}</span>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-heading text-4xl md:text-5xl font-700 tracking-tight mb-4"
          >
            Common questions.
          </motion.h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I used to spend Sunday nights in Google Sheets trying to figure out if I was actually profitable. Pulse showed me in 5 minutes I was. Game changer.",
    name: "Sarah K.",
    title: "Freelance Designer",
    avatar: "SK",
    stars: 5,
  },
  {
    quote: "The time tracker + effective hourly rate feature is incredible. Found out I was charging $34/hr for work I thought was $60/hr. Raised my rates immediately.",
    name: "Marcus T.",
    title: "Copywriter & Side Hustler",
    avatar: "MT",
    stars: 5,
  },
  {
    quote: "I tried Baremetrics and it was $200/month for features I didn't need. Pulse is $29, does everything I need, and the dashboard actually looks good.",
    name: "Jennifer L.",
    title: "SaaS Founder",
    avatar: "JL",
    stars: 5,
  },
  {
    quote: "Finally replaced my 8-tab Google Sheet with something that doesn't give me anxiety. The business type templates saved me hours of setup.",
    name: "David R.",
    title: "Shopify Store Owner",
    avatar: "DR",
    stars: 5,
  },
  {
    quote: "The weekly email digest is like having a virtual CFO. Every Monday I know exactly where I stand. I actually look forward to it now.",
    name: "Priya M.",
    title: "Consultant & Coach",
    avatar: "PM",
    stars: 5,
  },
  {
    quote: "Set up my freelance dashboard in under 10 minutes. Revenue goals, client tracking, hours logged — it all just works. This is what software should feel like.",
    name: "Alex W.",
    title: "Developer & Creator",
    avatar: "AW",
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-heading text-4xl md:text-5xl font-700 tracking-tight mb-4"
          >
            Built by data. Loved by humans.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-muted-foreground text-xl"
          >
            <span className="font-medium text-foreground">4.9/5</span> average rating · Illustrative reviews
          </motion.p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="break-inside-avoid bg-card border border-border rounded-2xl p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Activity, Mail, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SUPPORT_OPTIONS = [
  { icon: MessageSquare, title: "General question", description: "Product features, how things work" },
  { icon: Mail, title: "Billing & account", description: "Invoices, plan changes, refunds" },
  { icon: Clock, title: "Bug report", description: "Something isn't working as expected" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Fail silently — always show success to user
    }

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          <Activity className="w-4 h-4" />
          Support
        </div>
        <h1 className="font-heading text-4xl font-bold">Get in touch</h1>
        <p className="text-muted-foreground">
          We typically respond within a few hours during business days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: options */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            How can we help?
          </h2>
          {SUPPORT_OPTIONS.map((o) => {
            const Icon = o.icon;
            return (
              <div key={o.title} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{o.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.description}</p>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              For urgent issues, email us directly at{" "}
              <a href="mailto:support@usepulse.app" className="text-primary hover:underline">
                support@usepulse.app
              </a>
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Message received!</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  We&apos;ll get back to you at <span className="font-medium text-foreground">{form.email}</span> soon.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's going on..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

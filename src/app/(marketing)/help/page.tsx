import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Zap, Settings, CreditCard, LifeBuoy, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Centre — Pulse",
  description: "Guides, FAQs and support for Pulse.",
};

const CATEGORIES = [
  {
    icon: Zap,
    title: "Getting started",
    description: "Set up your account, pick your business type, and add your first metrics.",
    articles: ["Creating your account", "Choosing a business type", "Adding your first metric", "Setting up your dashboard"],
  },
  {
    icon: BookOpen,
    title: "Metrics & data",
    description: "Learn how to log data, build formulas, and set alerts.",
    articles: ["What are metrics?", "Logging a data point", "Importing data via CSV", "Built-in vs custom metrics"],
  },
  {
    icon: Settings,
    title: "Dashboard & widgets",
    description: "Customise your dashboards with charts, KPIs, and goal widgets.",
    articles: ["Creating a dashboard", "Adding widgets", "Rearranging the layout", "Dashboard themes"],
  },
  {
    icon: CreditCard,
    title: "Billing & plans",
    description: "Manage your subscription, upgrade, or cancel.",
    articles: ["Changing your plan", "Downloading invoices", "Cancelling your subscription", "What's included in each plan"],
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          <LifeBuoy className="w-4 h-4" />
          Help Centre
        </div>
        <h1 className="font-heading text-4xl font-bold">How can we help?</h1>
        <p className="text-muted-foreground">
          Browse guides below or{" "}
          <Link href="/contact" className="text-primary hover:underline">contact support</Link>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.title} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold">{cat.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {cat.articles.map((article) => (
                  <li key={article}>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 cursor-pointer group">
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      {article}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center p-8 rounded-2xl bg-primary/5 border border-primary/20">
        <h3 className="font-heading font-semibold text-lg mb-2">Still need help?</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Our support team is here to help. We typically respond within a few hours.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Contact support <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

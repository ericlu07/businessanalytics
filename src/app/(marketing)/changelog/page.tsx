import type { Metadata } from "next";
import { Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog — Pulse",
  description: "What's new in Pulse — updates, improvements, and bug fixes.",
};

const CHANGELOG = [
  {
    version: "1.0.0",
    date: "April 30, 2025",
    tag: "Launch",
    tagColor: "bg-primary/10 text-primary",
    entries: [
      { type: "new", text: "Initial public launch of Pulse 🎉" },
      { type: "new", text: "Dashboard with customisable widgets (KPI tiles, line charts, bar charts, donut charts, goal progress)" },
      { type: "new", text: "Metric library with 40+ built-in metrics across Financial, Sales, Marketing, Operations, and more" },
      { type: "new", text: "Manual data entry and CSV bulk import" },
      { type: "new", text: "Goals system — set targets, track progress, mark complete" },
      { type: "new", text: "Time tracker with project, client, and hourly rate tracking" },
      { type: "new", text: "Reports — generate and share business snapshots" },
      { type: "new", text: "Notifications for goal milestones and metric alerts" },
      { type: "new", text: "Dark mode + customisable themes" },
      { type: "new", text: "Command palette (⌘K) for quick navigation" },
      { type: "new", text: "Business type templates: Freelancer, Side Hustle, E-commerce, SaaS, Creator, and more" },
    ],
  },
];

const typeStyles: Record<string, string> = {
  new: "bg-green-500/10 text-green-600 dark:text-green-400",
  improved: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  fixed: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  removed: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          <Activity className="w-4 h-4" />
          What&apos;s new
        </div>
        <h1 className="font-heading text-4xl font-bold">Changelog</h1>
        <p className="text-muted-foreground">Every update, improvement, and fix — in one place.</p>
      </div>

      <div className="space-y-12">
        {CHANGELOG.map((release) => (
          <div key={release.version} className="relative pl-6 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />

            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-heading font-bold text-xl">v{release.version}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${release.tagColor}`}>
                {release.tag}
              </span>
              <span className="text-sm text-muted-foreground ml-auto">{release.date}</span>
            </div>

            <ul className="space-y-2">
              {release.entries.map((entry, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className={`mt-0.5 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${typeStyles[entry.type] ?? ""} shrink-0`}>
                    {entry.type}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{entry.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

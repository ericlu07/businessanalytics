"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DashboardTemplate } from "@/lib/metrics/templates";

type Step = "welcome" | "business_type" | "business_name" | "complete";

interface OnboardingClientProps {
  userName?: string | null;
  templates: Record<string, DashboardTemplate>;
}

const businessTypeIcons: Record<string, string> = {
  FREELANCER: "💼",
  SIDE_HUSTLE: "⚡",
  ECOMMERCE: "🛒",
  SERVICE_BUSINESS: "🔧",
  SAAS: "🚀",
  CREATOR: "🎨",
  CUSTOM: "✨",
};

export function OnboardingClient({ userName, templates }: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedType, setSelectedType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType: selectedType, businessName: businessName || null }),
      });
      setStep("complete");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-heading font-semibold text-lg">Pulse</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {(["welcome", "business_type", "business_name"] as Step[]).map((s, i) => {
          const steps: Step[] = ["welcome", "business_type", "business_name"];
          const current = steps.indexOf(step);
          const index = i;
          return (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                current >= index ? "w-8 bg-primary" : "w-4 bg-muted"
              )}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="text-center max-w-md"
          >
            <h1 className="font-heading font-700 text-4xl mb-4">
              Hi {userName?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Let&apos;s set up your Pulse dashboard. It takes about 2 minutes and you&apos;ll have a live business dashboard at the end.
            </p>
            <Button size="lg" onClick={() => setStep("business_type")} className="gap-2">
              Let&apos;s go
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {step === "business_type" && (
          <motion.div
            key="business_type"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="w-full max-w-2xl"
          >
            <h2 className="font-heading font-700 text-2xl text-center mb-2">What best describes your business?</h2>
            <p className="text-muted-foreground text-center mb-8">We&apos;ll pre-configure your dashboard with the most relevant metrics.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {Object.entries(templates).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={cn(
                    "relative p-4 rounded-2xl border text-left transition-all",
                    selectedType === key
                      ? "border-primary bg-primary/8 ring-1 ring-primary"
                      : "border-border bg-card hover:bg-muted"
                  )}
                >
                  {selectedType === key && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <span className="text-2xl mb-2 block">{businessTypeIcons[key]}</span>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setStep("business_name")}
                disabled={!selectedType}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "business_name" && (
          <motion.div
            key="business_name"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="text-center max-w-md w-full"
          >
            <h2 className="font-heading font-700 text-2xl mb-2">What&apos;s your business called?</h2>
            <p className="text-muted-foreground mb-8">Optional — we&apos;ll use this to personalize your dashboard.</p>
            <Input
              placeholder="My Awesome Business"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="text-center text-base mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleFinish()}
            />
            <div className="flex flex-col gap-2">
              <Button size="lg" onClick={handleFinish} disabled={saving} className="gap-2">
                {saving ? "Setting up..." : "Set up my dashboard"}
                {!saving && <ArrowRight className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleFinish} disabled={saving}>
                Skip for now
              </Button>
            </div>
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-heading font-700 text-2xl mb-2">You&apos;re all set!</h2>
            <p className="text-muted-foreground">Taking you to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

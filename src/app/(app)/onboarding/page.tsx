import { requireUserProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./onboarding-client";
import { BUSINESS_TEMPLATES } from "@/lib/metrics/templates";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Welcome to Pulse" };

export default async function OnboardingPage() {
  const { profile } = await requireUserProfile();

  if (profile.onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingClient
        userName={profile.name}
        templates={BUSINESS_TEMPLATES}
      />
    </div>
  );
}

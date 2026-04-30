import { HeroSection } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing";
import { FaqSection } from "@/components/marketing/faq";
import { CtaSection } from "@/components/marketing/cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse — Business Analytics for Humans",
  description:
    "Replace Google Sheets with a beautiful, customizable analytics dashboard. Track revenue, clients, goals, and time — built for solopreneurs and small businesses.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}

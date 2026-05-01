import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Demo / test mode — set DEMO_MODE=true in .env.local to bypass all auth.
// The app will be fully usable with mock data, no Supabase required.
// ---------------------------------------------------------------------------
const DEMO = process.env.DEMO_MODE === "true";

export const DEMO_PROFILE = {
  id: "demo-user-id",
  email: "demo@usepulse.app",
  name: "Demo User",
  avatarUrl: null,
  role: "USER" as const,
  businessType: "SAAS" as const,
  businessName: "Acme SaaS Co.",
  currency: "USD",
  timezone: "America/New_York",
  fiscalYearStart: 1,
  onboardingComplete: true,
  stripeCustomerId: null,
  subscriptionId: null,
  subscriptionPlan: "FREE" as const,
  subscriptionStatus: null,
  trialEndsAt: null,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date(),
  deletedAt: null,
};

export function isDemoMode() {
  return DEMO;
}

export async function getUser() {
  if (DEMO) return { id: "demo-user-id", email: "demo@usepulse.app" } as never;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  if (DEMO) return { id: "demo-user-id", email: "demo@usepulse.app" } as never;
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function getUserProfile(supabaseUserId: string) {
  if (DEMO) return DEMO_PROFILE;
  return db.user.findUnique({ where: { id: supabaseUserId } });
}

export async function requireUserProfile() {
  if (DEMO) return { supaUser: { id: "demo-user-id", email: "demo@usepulse.app" } as never, profile: DEMO_PROFILE };
  const supaUser = await requireUser();
  const profile = await getUserProfile(supaUser.id);
  if (!profile) redirect("/login");
  return { supaUser, profile };
}

export async function requireAdmin() {
  if (DEMO) return DEMO_PROFILE;
  const { profile } = await requireUserProfile();
  if (profile.role !== "ADMIN") redirect("/dashboard");
  return profile;
}

export async function getSession() {
  if (DEMO) return null;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

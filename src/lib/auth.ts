import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function getUserProfile(supabaseUserId: string) {
  return db.user.findUnique({
    where: { id: supabaseUserId },
  });
}

export async function requireUserProfile() {
  const supaUser = await requireUser();
  const profile = await getUserProfile(supaUser.id);
  if (!profile) redirect("/login");
  return { supaUser, profile };
}

export async function requireAdmin() {
  const { profile } = await requireUserProfile();
  if (profile.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return profile;
}

export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

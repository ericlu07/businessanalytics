import { requireUserProfile } from "@/lib/auth";
import { Topbar } from "@/components/app/topbar";
import { SettingsClient } from "./settings-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { profile } = await requireUserProfile();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Settings" }]} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <SettingsClient profile={JSON.parse(JSON.stringify(profile))} />
      </main>
    </div>
  );
}

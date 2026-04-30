"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, CreditCard, Bell, Shield, Plug } from "lucide-react";
import { BUSINESS_TEMPLATES } from "@/lib/metrics/templates";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NZD", "JPY", "CHF", "INR", "BRL"];
const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Singapore", "Australia/Sydney", "Pacific/Auckland"];

interface Profile {
  id: string;
  name: string | null;
  email: string;
  businessName: string | null;
  businessType: string | null;
  currency: string;
  timezone: string;
  subscriptionPlan: string;
}

export function SettingsClient({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.name ?? "");
  const [businessName, setBusinessName] = useState(profile.businessName ?? "");
  const [businessType, setBusinessType] = useState(profile.businessType ?? "");
  const [currency, setCurrency] = useState(profile.currency);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, businessName, businessType, currency, timezone }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  }

  const planColors: Record<string, string> = {
    FREE: "bg-secondary text-secondary-foreground",
    SOLO: "bg-blue-500/10 text-blue-600",
    PRO: "bg-primary/10 text-primary",
    TEAM: "bg-amber-500/10 text-amber-600",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-700 text-2xl">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-2"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><CreditCard className="w-3.5 h-3.5" />Billing</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2"><Plug className="w-3.5 h-3.5" />Integrations</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-3.5 h-3.5" />Notifications</TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="font-heading font-600 text-base mb-4">Personal info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={profile.email} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground">Contact support to change email.</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="font-heading font-600 text-base mb-4">Business info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Business name</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Business" />
                </div>
                <div className="space-y-1.5">
                  <Label>Business type</Label>
                  <Select value={businessType} onValueChange={(v) => setBusinessType(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BUSINESS_TEMPLATES).map(([key, t]) => (
                        <SelectItem key={key} value={key}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={(v) => setTimezone(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="font-heading font-600 text-base mb-4">Current plan</h2>
              <div className="flex items-center gap-3 mb-6">
                <Badge className={planColors[profile.subscriptionPlan] ?? planColors["FREE"]}>
                  {profile.subscriptionPlan}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {profile.subscriptionPlan === "FREE" ? "Free plan — upgrade to unlock more features" : "Active subscription"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { plan: "Solo", price: "$12/mo", features: "Unlimited widgets, goals, reports" },
                  { plan: "Pro", price: "$29/mo", features: "Everything + integrations, team sharing" },
                  { plan: "Team", price: "$59/mo", features: "Up to 10 users, admin dashboard" },
                ].map((p) => (
                  <div key={p.plan} className="border border-border rounded-xl p-4">
                    <p className="font-heading font-600 text-sm mb-1">{p.plan}</p>
                    <p className="font-heading font-700 text-lg mb-2">{p.price}</p>
                    <p className="text-xs text-muted-foreground mb-3">{p.features}</p>
                    <Button size="sm" variant="outline" className="w-full text-xs">Upgrade</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Integrations tab */}
        <TabsContent value="integrations">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-heading font-600 text-base mb-4">Integrations</h2>
            {[
              { name: "Stripe", desc: "Auto-sync revenue, MRR, and customer data", status: "available" },
              { name: "PayPal", desc: "Auto-sync PayPal transaction data", status: "available" },
              { name: "Google Sheets", desc: "Two-way sync with your spreadsheets", status: "coming_soon" },
              { name: "Shopify", desc: "Sync orders, revenue, and products", status: "coming_soon" },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">{integration.desc}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={integration.status === "coming_soon"}
                  className="text-xs shrink-0"
                >
                  {integration.status === "coming_soon" ? "Coming soon" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-600 text-base mb-4">Email notifications</h2>
            <div className="space-y-4">
              {[
                { label: "Weekly business digest", desc: "Monday morning summary of your key metrics", enabled: true },
                { label: "Goal milestone alerts", desc: "When you hit 50%, 75%, and 100% of a goal", enabled: true },
                { label: "Metric anomaly alerts", desc: "When a metric drops or spikes significantly", enabled: false },
                { label: "Monthly summary", desc: "End-of-month report with trends", enabled: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${n.enabled ? "bg-primary" : "bg-muted"} relative`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${n.enabled ? "translate-x-5 left-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Pulse",
  description: "Terms and conditions for using Pulse.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-10">Last updated: April 30, 2025</p>

      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using Pulse, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pulse is a business analytics platform for small businesses and side hustles. It allows you to track metrics, set goals, log time, and generate reports. Features vary by subscription plan.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">3. Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for maintaining the security of your account and all activity that occurs under it. You must provide accurate information when registering. You may not share your account with others or use Pulse for unlawful purposes.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">4. Payments & Subscriptions</h2>
          <p className="text-muted-foreground leading-relaxed">
            Paid plans are billed monthly or annually via Stripe. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are handled on a case-by-case basis — contact support within 7 days of a charge. Downgrading your plan takes effect at the next billing cycle.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">5. Your Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            You retain ownership of all data you enter into Pulse. You grant us a limited licence to store and process that data solely to provide the service. We do not access your business data except for troubleshooting with your explicit permission.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">6. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to: reverse-engineer the service, attempt to gain unauthorised access to other accounts, use the service to transmit spam or malware, or violate any applicable laws.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pulse is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for lost profits, data loss, or indirect damages. Our total liability is limited to the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">8. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            You may cancel your account at any time from Settings. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, your data will be deleted within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">9. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Questions? Email <a href="mailto:legal@usepulse.app" className="text-primary hover:underline">legal@usepulse.app</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

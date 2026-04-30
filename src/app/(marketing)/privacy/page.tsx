import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pulse",
  description: "How Pulse collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: April 30, 2025</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly — your name, email address, and business details when you create an account. We also collect data you enter into Pulse, such as metrics, goals, and time entries. Usage data (page views, feature interactions) is collected automatically to improve the product.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use your information to provide and improve Pulse, send transactional emails (e.g. password resets, weekly digests), process payments via Stripe, and respond to support requests. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">3. Data Storage & Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data is stored securely using Supabase (PostgreSQL) hosted on AWS infrastructure. All data is encrypted in transit (TLS) and at rest. We follow industry-standard security practices and conduct regular reviews.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">4. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pulse uses the following third-party services: <strong>Supabase</strong> (authentication and database), <strong>Stripe</strong> (payment processing), and <strong>Resend</strong> (transactional email). Each service has its own privacy policy and data handling practices.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">5. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You may request access to, correction of, or deletion of your personal data at any time by emailing us at privacy@usepulse.app. We will respond within 30 days. You may also delete your account directly from the Settings page, which permanently removes all your data.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">6. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use essential cookies for authentication (session management). We do not use advertising or tracking cookies. You can disable cookies in your browser, but this will prevent you from logging in.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">7. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this policy occasionally. Significant changes will be communicated via email. Continued use of Pulse after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">8. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Questions about this policy? Email us at <a href="mailto:privacy@usepulse.app" className="text-primary hover:underline">privacy@usepulse.app</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

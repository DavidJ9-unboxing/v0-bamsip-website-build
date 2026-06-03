import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy — BamSip",
  description: "BamSip privacy policy and data handling practices.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Header variant="bammers" />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-cream mb-8">Privacy Policy</h1>

          <div className="prose prose-invert prose-cream max-w-none space-y-6 text-cream2">
            <p className="text-mute text-sm">Last updated: May 2026</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                1. Information We Collect
              </h2>
              <p>
                When you sign up for BamSip, we collect your email address,
                mobile number, and city. For venues, we also collect your name,
                venue name, and role.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                2. How We Use Your Information
              </h2>
              <p>
                We use your information to notify you when BamSip launches in
                your city, send you relevant deals and offers, and improve our
                service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                3. Data Protection
              </h2>
              <p>
                Your data is stored securely and we never sell your personal
                information to third parties. We comply with GDPR and UK data
                protection laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">4. Contact</h2>
              <p>
                For any privacy-related questions, contact us at
                privacy@bamsip.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer variant="bammers" />
    </div>
  )
}

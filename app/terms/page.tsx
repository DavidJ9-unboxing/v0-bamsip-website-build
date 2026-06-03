import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service — BamSip",
  description: "BamSip terms of service and conditions of use.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Header variant="bammers" />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-cream mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-invert prose-cream max-w-none space-y-6 text-cream2">
            <p className="text-mute text-sm">Last updated: May 2026</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using BamSip, you agree to be bound by these
                Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                2. Use of Service
              </h2>
              <p>
                BamSip provides a platform connecting consumers with venue
                offers. You must be 18 or older to use our service. You agree
                not to misuse the platform or attempt to circumvent our systems.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                3. Deals and Redemption
              </h2>
              <p>
                All deals are subject to availability and the terms set by
                individual venues. BamSip acts as an intermediary and is not
                responsible for the quality of service provided by venues.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">
                4. Limitation of Liability
              </h2>
              <p>
                BamSip is provided &ldquo;as is&rdquo; without warranties of any
                kind. We are not liable for any indirect, incidental, or
                consequential damages arising from your use of the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-cream">5. Contact</h2>
              <p>
                For any questions about these terms, contact us at
                legal@bamsip.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer variant="bammers" />
    </div>
  )
}

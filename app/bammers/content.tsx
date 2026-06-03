"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureGrid } from "@/components/feature-grid"
import { FAQ } from "@/components/faq"
import { SocialProof } from "@/components/social-proof"
import { SignupForm } from "@/components/signup-form"
import { Wallet, Zap, Users, Eye } from "lucide-react"

const features = [
  {
    icon: Wallet,
    headline: "Pre-buy at a discount",
    body: "Lock in your drinks before you arrive. Pay less. Skip the bar queue. Show up. Scan. Sip.",
  },
  {
    icon: Zap,
    headline: "Flash deals all night",
    body: "As the night unfolds, real-time offers get pushed to you, matched to where you are and what you like.",
  },
  {
    icon: Users,
    headline: "Plan with friends",
    body: "Share a venue, a deal, or a whole night to your group chat in one tap. Everyone arrives ready.",
  },
  {
    icon: Eye,
    headline: "No more guessing",
    body: "See the vibe, see who's going, see what's on tonight. Decide before you leave the house.",
  },
]

const faqItems = [
  {
    question: "When does BamSip launch in Manchester?",
    answer:
      "Soft launch in May 2026. Hard launch at Freshers' Week, September 2026.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. Free to download, free to use. You only pay for the drinks you buy through the app — at a discount.",
  },
  {
    question: "Which cities are next?",
    answer:
      "Leeds (late 2026), Liverpool and Birmingham (early 2027), London (2027). Drop your city when you sign up so we know where to launch.",
  },
  {
    question: "How do flash deals work?",
    answer:
      "Venues push offers when they want to fill a quiet window. You see them in real time, locked to a cap and a time window so they're never devalued.",
  },
  {
    question: "What if my venue isn't on it yet?",
    answer:
      "Tell us — there's a \"request my venue\" field after you sign up. We're onboarding venues in Manchester now.",
  },
]

export function BammersContent() {
  return (
    <div className="min-h-screen bg-ink">
      <Header variant="bammers" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight lowercase mb-6">
              <span className="text-cream">smarter</span>
              <br />
              <span className="text-flame">nights out.</span>
            </h1>
            <p className="text-lg sm:text-xl text-cream2 mb-12 max-w-2xl mx-auto">
              pre-buy drinks. grab flash deals. skip the hassle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <SignupForm variant="bammer" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <FeatureGrid features={features} sectionLabel="Why BamSip" />

      {/* Demo Video Placeholder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ink2">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-2xl border border-hairline overflow-hidden bg-ink3 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-flame/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-flame/30 transition-colors">
                <svg
                  className="w-8 h-8 text-flame ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-mute text-sm">Demo video coming soon</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof variant="compact" />

      {/* FAQ */}
      <FAQ items={faqItems} />

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ink2">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <SignupForm
              variant="bammer"
              headline="don't miss the manchester launch."
            />
          </motion.div>
        </div>
      </section>

      <Footer variant="bammers" />
    </div>
  )
}

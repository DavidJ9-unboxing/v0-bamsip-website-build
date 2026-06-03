"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureGrid } from "@/components/feature-grid"
import { FAQ } from "@/components/faq"
import { SocialProof } from "@/components/social-proof"
import { SignupForm } from "@/components/signup-form"
import { HowItWorks } from "@/components/how-it-works"
import { Timer, Wallet, BarChart3, Shield } from "lucide-react"

const features = [
  {
    icon: Timer,
    headline: "Live offers, 15 seconds",
    body: "Push a deal when you need traffic, not the next day. Set the window, set the cap, hit live.",
  },
  {
    icon: Wallet,
    headline: "Pre-sold drinks",
    body: "Customers pay before they walk in. Spend is locked in. The bar doesn't sit dead.",
  },
  {
    icon: BarChart3,
    headline: "Real attribution",
    body: "For the first time, see what drove every redemption, every visit, every pound.",
  },
  {
    icon: Shield,
    headline: "Controlled value, not discount race",
    body: "You set the rules. BamSip is not Groupon. We're trying not to break nightlife pricing.",
  },
]

const howItWorksSteps = [
  {
    number: 1,
    headline: "Onboard in 15 minutes",
    body: "Add your venue, your offers, your operating hours.",
  },
  {
    number: 2,
    headline: "Push a live offer",
    body: "Tuesday looks quiet. 20% off cocktails, 6–9, capped at 80. One tap.",
  },
  {
    number: 3,
    headline: "Watch it work",
    body: "Bammers see it instantly. Redemptions tick up in real time. The bar fills.",
  },
]

const faqItems = [
  {
    question: "What does it cost?",
    answer:
      "We're finalising pricing before launch. Likely a percentage of redemptions, no monthly fee. Register interest to be part of the conversation.",
  },
  {
    question: "Do I keep control of pricing?",
    answer:
      "Yes. You set the discount, the cap, the time window, and the visibility. BamSip never auto-discounts on your behalf.",
  },
  {
    question: "How fast can I get set up?",
    answer:
      "Fifteen minutes to onboard. Fifteen seconds to push a live offer once you're in.",
  },
  {
    question: "What about my POS / EPOS?",
    answer:
      "Day one, it's a redemption code at the bar. Future integrations with major EPOS systems are on the roadmap.",
  },
  {
    question: "Who owns the customer relationship?",
    answer:
      "You do. BamSip is the channel. Customers redeem at your bar, your way.",
  },
  {
    question: "Which cities are you in?",
    answer:
      "Manchester first (May 2026). Leeds Q4 2026. Liverpool and Birmingham 2027. London 2027. Register interest from any city.",
  },
]

export function VenuesContent() {
  return (
    <div className="min-h-screen bg-ink">
      <Header variant="venues" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight lowercase mb-6">
              <span className="text-cream">fill your</span>
              <br />
              <span className="text-flame">dead nights.</span>
            </h1>
            <p className="text-lg sm:text-xl text-cream2 mb-12 max-w-2xl mx-auto">
              {"the operator's tool for live offers, pre-sold drinks, and real attribution. push a deal in 15 seconds."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <SignupForm variant="venue" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <FeatureGrid features={features} sectionLabel="Built for operators" />

      {/* How It Works */}
      <HowItWorks steps={howItWorksSteps} />

      {/* Social Proof - Full variant for venues */}
      <SocialProof variant="full" />

      {/* Demo Video Placeholder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ink">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-flame text-xs font-medium tracking-wider uppercase mb-4 text-center">
              See it in action
            </p>
            <div className="relative aspect-video rounded-2xl border border-hairline overflow-hidden bg-ink2 flex items-center justify-center">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqItems} sectionLabel="Operator FAQ" />

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
              variant="venue"
              headline="the manchester rollout starts now."
            />
          </motion.div>
        </div>
      </section>

      <Footer variant="venues" />
    </div>
  )
}

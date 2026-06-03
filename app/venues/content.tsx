"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Timer, Wallet, BarChart3, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBackground } from "@/components/hero-background"
import { VenueDashboard } from "@/components/venue-dashboard"
import { FeatureGrid } from "@/components/feature-grid"
import { HowItWorks } from "@/components/how-it-works"
import { FAQ } from "@/components/faq"
import { SocialProof } from "@/components/social-proof"
import { SignupForm } from "@/components/signup-form"

const features = [
  {
    icon: Timer,
    headline: "Live offers, 15 seconds",
    body: "Push a deal when you need traffic, not the next day. Set the window, set the cap, go live.",
  },
  {
    icon: Wallet,
    headline: "Pre-sold drinks",
    body: "Guests pay before they walk in. Spend is locked in. The bar doesn't sit dead.",
  },
  {
    icon: BarChart3,
    headline: "Real attribution",
    body: "See what drove every redemption, every visit, every pound.",
  },
  {
    icon: SlidersHorizontal,
    headline: "Controlled value",
    body: "You set the rules. BamSip is not a discount race.",
  },
]

const howItWorksSteps = [
  {
    number: 1,
    headline: "onboard in 15 minutes",
    body: "add your venue, your offers, your operating hours.",
  },
  {
    number: 2,
    headline: "push a live offer",
    body: "tuesday looks quiet? 2-4-1 cocktails, 6–9, capped at 80. one tap.",
  },
  {
    number: 3,
    headline: "watch it work",
    body: "bammers see it instantly. redemptions tick up in real time. the bar fills.",
  },
]

const faqItems = [
  {
    question: "What does BamSip cost?",
    answer:
      "We're finalising pricing before launch — likely a share of redemptions, no monthly fee. Register interest to be part of the conversation.",
  },
  {
    question: "Do venues control pricing?",
    answer:
      "Always. You set the offer, the cap, the time window, and the visibility. BamSip never auto-discounts on your behalf.",
  },
  {
    question: "How fast can we go live?",
    answer:
      "Around 15 minutes to onboard, then 15 seconds to push a live offer once you're in.",
  },
  {
    question: "Does it integrate with EPOS?",
    answer:
      "Day one it's a redemption at the bar. Integrations with major EPOS systems are on the roadmap.",
  },
  {
    question: "Who owns the customer relationship?",
    answer:
      "You do. BamSip is the channel — guests redeem at your bar, your way.",
  },
  {
    question: "Which cities are next?",
    answer:
      "Manchester first. Other UK cities follow once the rollout is bedded in. Register interest from any city.",
  },
]

export function VenuesContent() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ink2/60 px-3 py-1 text-xs text-cream2 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                for operators
              </span>
              <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-cream sm:text-6xl lg:text-7xl">
                <span className="lowercase">fill your </span>
                <span className="lowercase text-flame">dead nights.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-cream2">
                the operator&apos;s tool for live offers, pre-sold drinks, and
                real attribution. push a deal in 15 seconds.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="#interest"
                  className="inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-semibold text-cream outline-none transition-all hover:bg-flame-soft focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  register interest
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Dashboard visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-14 max-w-4xl"
          >
            <VenueDashboard />
          </motion.div>
        </div>
      </section>

      <FeatureGrid features={features} sectionLabel="Built for operators" />

      <HowItWorks steps={howItWorksSteps} />

      <SocialProof variant="full" />

      <FAQ items={faqItems} sectionLabel="Operator FAQ" />

      {/* Venue lead form */}
      <section
        id="interest"
        className="relative overflow-hidden border-t border-hairline px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(255,181,71,0.16), transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <h2 className="mb-8 font-display text-3xl font-bold lowercase text-balance text-cream sm:text-4xl">
            the manchester rollout starts now.
          </h2>
          <SignupForm variant="venue" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

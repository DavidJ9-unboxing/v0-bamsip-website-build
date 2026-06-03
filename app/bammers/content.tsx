"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Wallet, Zap, Users, Eye } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBackground } from "@/components/hero-background"
import { FeatureGrid } from "@/components/feature-grid"
import { HowItWorks } from "@/components/how-it-works"
import { FAQ } from "@/components/faq"
import { SocialProof } from "@/components/social-proof"
import { DemoSection } from "@/components/demo-section"
import { SignupForm } from "@/components/signup-form"

const features = [
  {
    icon: Wallet,
    headline: "Pre-buy at a discount",
    body: "Lock in drinks before you arrive. Pay less. Walk in ready.",
  },
  {
    icon: Zap,
    headline: "Flash deals all night",
    body: "Live offers drop as the night moves. Catch them in real time.",
  },
  {
    icon: Users,
    headline: "Plan with friends",
    body: "Share a venue, deal, or night to the group chat in one tap.",
  },
  {
    icon: Eye,
    headline: "No more guessing",
    body: "See the vibe, what's live, and where the night is moving.",
  },
]

const howItWorksSteps = [
  {
    number: 1,
    headline: "discover what's live",
    body: "open the map, filter by vibe, find the deals near you tonight.",
  },
  {
    number: 2,
    headline: "pre-buy before you arrive",
    body: "lock in your drinks at a discount and skip the bar queue.",
  },
  {
    number: 3,
    headline: "tap to redeem",
    body: "hold your phone to the reader at the bar. sorted.",
  },
]

const faqItems = [
  {
    question: "When is BamSip available?",
    answer:
      "Manchester first — we're onboarding venues now. Drop your city when you sign up and we'll let you know when we land near you.",
  },
  {
    question: "Is BamSip free to use?",
    answer:
      "Yes. Free to download, free to use. You only pay for the drinks you pre-buy — at a discount.",
  },
  {
    question: "How do flash deals work?",
    answer:
      "Venues push live offers when they want to fill a quiet window. You see them in real time, capped and time-limited so they stay good.",
  },
  {
    question: "Can I plan with friends?",
    answer:
      "Share a venue, a deal, or a whole night to the group chat in one tap. Everyone arrives ready.",
  },
  {
    question: "What if my venue isn't listed?",
    answer:
      "Tell us — there's a request field after you sign up. We're adding Manchester venues every week.",
  },
]

export function BammersContent() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ink2/60 px-3 py-1 text-xs text-cream2 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              for bammers
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-cream sm:text-6xl lg:text-7xl">
              <span className="lowercase">smarter </span>
              <span className="lowercase text-flame">nights out.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-cream2">
              pre-buy drinks. grab flash deals. skip the hassle.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="#waitlist"
                className="inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-semibold text-cream outline-none transition-all hover:bg-flame-soft focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                get early access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureGrid features={features} sectionLabel="Why BamSip" />

      <DemoSection />

      <HowItWorks steps={howItWorksSteps} />

      <SocialProof variant="compact" />

      <FAQ items={faqItems} />

      {/* Signup CTA */}
      <section
        id="waitlist"
        className="relative overflow-hidden border-t border-hairline px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(255,107,84,0.18), transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <h2 className="mb-8 font-display text-3xl font-bold lowercase text-balance text-cream sm:text-4xl">
            don&apos;t miss the manchester launch.
          </h2>
          <SignupForm variant="bammer" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

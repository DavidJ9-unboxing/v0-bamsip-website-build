"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBackground } from "@/components/hero-background"
import { PhoneDemo } from "@/components/phone-demo"
import { PainPoints } from "@/components/pain-points"
import { BenefitsTriad } from "@/components/benefits-triad"
import { Testimonials } from "@/components/testimonials"
import { ValueStack } from "@/components/value-stack"
import { HowItWorks } from "@/components/how-it-works"
import { FAQ } from "@/components/faq"
import { SocialProof } from "@/components/social-proof"
import { DemoSection } from "@/components/demo-section"
import { SignupForm } from "@/components/signup-form"
import { images } from "@/lib/images"

const howItWorksSteps = [
  {
    number: 1,
    headline: "find your night",
    body: "browse themed events, live music and bammer-only nights happening near you.",
  },
  {
    number: 2,
    headline: "lock it in with mates",
    body: "grab your spot, pre-buy your drinks at a discount, share the plan to the group.",
  },
  {
    number: 3,
    headline: "turn up and tap",
    body: "hold your phone to the reader at the bar. sorted — now enjoy the night.",
  },
]

const faqItems = [
  {
    question: "When is BamSip available?",
    answer:
      "Manchester first — we're onboarding venues now. Drop your city when you register and we'll let you know when we land near you.",
  },
  {
    question: "Is BamSip free to use?",
    answer:
      "Yes. Free to download, free to use. You only pay for the drinks you pre-buy — at a discount.",
  },
  {
    question: "What are bammer-only nights?",
    answer:
      "Themed events and live-music nights we put on with our venues, exclusive to BamSip members. Early access to tickets, special line-ups, and drinks deals you won't get anywhere else.",
  },
  {
    question: "How do flash deals work?",
    answer:
      "Venues push live offers when they want to fill a quiet window. You see them in real time, capped and time-limited so they stay good.",
  },
  {
    question: "Can I plan the night with friends?",
    answer:
      "Share an event, a venue, or a whole night to the group chat in one tap. Everyone grabs their spot and arrives ready.",
  },
  {
    question: "What if my venue isn't listed?",
    answer:
      "Tell us — there's a request field after you register. We're adding Manchester venues every week.",
  },
]

export function BammersContent() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />

      {/* STEP 1 — Need / desire */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
        <HeroBackground />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
          <div className="text-center lg:text-left">
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
              <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-cream2 lg:mx-0">
                the night you actually wanted, with the people you want to be
                with. themed events, live music and bammer-only nights — plus
                your drinks pre-bought for less before you even head out.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {["free to download", "save up to 40%", "bammer-only events"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-hairline bg-ink2/60 px-3 py-1 text-xs text-cream2 backdrop-blur"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="[perspective:1200px]">
              <div className="[transform:rotateY(-6deg)]">
                <PhoneDemo float />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual break — the vibe */}
      <section className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            { img: images.crowd, label: "nights with your people" },
            { img: images.live, label: "live music & themed events" },
            { img: images.toast, label: "bammer-only nights" },
          ].map((item, i) => (
            <motion.figure
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative h-56 overflow-hidden rounded-2xl border border-hairline"
            >
              <Image
                src={item.img.src || "/placeholder.svg"}
                alt={item.img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 font-display text-lg font-semibold lowercase text-cream">
                {item.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* STEP 2 — What's wrong with current solutions */}
      <PainPoints />

      {/* STEP 3 — Benefits (functional / emotional / financial) */}
      <BenefitsTriad />

      {/* STEP 4 — Reasons to believe: see it, learn the mechanism, trust the backers */}
      <DemoSection />
      <HowItWorks steps={howItWorksSteps} />
      <SocialProof variant="compact" />

      {/* STEP 5 — Testimonials */}
      <Testimonials />

      {/* STEP 6 — Build the value */}
      <ValueStack />

      {/* Objection handling */}
      <FAQ items={faqItems} />

      {/* STEP 7 — CTA */}
      <section
        id="waitlist"
        className="relative overflow-hidden border-t border-hairline px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(255,107,84,0.18), transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <h2 className="mb-3 font-display text-3xl font-bold lowercase text-balance text-cream sm:text-4xl">
            be first through the door.
          </h2>
          <p className="mb-8 text-cream2">
            register your interest and we&apos;ll get you in for the Manchester
            launch.
          </p>
          <SignupForm variant="bammer" />
        </div>
      </section>

      <Footer />

      {/* Floating CTA — the only persistent CTA on this page */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
      >
        <Link
          href="#waitlist"
          className="inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3.5 text-sm font-semibold text-cream shadow-lg shadow-flame/30 outline-none transition-all hover:bg-flame-soft hover:shadow-flame/50 focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cream/70 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cream" />
          </span>
          register interest
        </Link>
      </motion.div>
    </div>
  )
}

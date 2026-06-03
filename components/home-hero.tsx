"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Store } from "lucide-react"
import { HeroBackground } from "./hero-background"
import { PhoneDemo } from "./phone-demo"

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      <HeroBackground />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-3 py-1 text-xs font-medium text-flame backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flame" />
              Manchester rollout — now onboarding
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-cream sm:text-6xl lg:text-7xl">
              <span className="lowercase">smarter </span>
              <span className="lowercase text-flame">nights out.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-cream2 lg:mx-0">
              see where the best deals are right now, plus events and bammer-only
              nights worth planning for — with your drinks pre-bought for less
              before you head out.
            </p>

            {/* Proof chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {["free to download", "live deals near you", "save up to 40%"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-hairline bg-ink2/60 px-3 py-1 text-xs text-cream2 backdrop-blur"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/#waitlist"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-semibold text-cream outline-none transition-all hover:bg-flame-soft focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
              >
                get early access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-ink2/60 px-6 py-3 text-sm font-semibold text-cream backdrop-blur outline-none transition-colors hover:border-flame/40 focus-visible:ring-2 focus-visible:ring-flame sm:w-auto"
              >
                see the app
              </Link>
            </div>

            <Link
              href="/venues"
              className="mt-6 inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-amber"
            >
              <Store className="h-4 w-4 text-amber" />
              run a venue? fill your quiet nights.
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Phone */}
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
  )
}

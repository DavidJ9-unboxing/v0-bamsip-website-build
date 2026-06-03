"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Zap, Wallet, BarChart3, SlidersHorizontal } from "lucide-react"

const features = [
  { icon: Zap, title: "Live offers in 15 seconds", body: "Push a deal when you need traffic, not the next day." },
  { icon: Wallet, title: "Pre-sold drinks", body: "Guests pay before they walk in. Spend is locked in." },
  { icon: BarChart3, title: "Real attribution", body: "See what drove every redemption, visit, and pound." },
  { icon: SlidersHorizontal, title: "Full control", body: "You set the rules. BamSip is not a discount race." },
]

export function VenuesTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-ink2 px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(255,181,71,0.18), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-amber">
            for venues
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold lowercase text-balance text-cream sm:text-5xl">
            fill your dead nights.
          </h2>
          <p className="mt-4 text-lg text-cream2">
            push live offers, pre-sell drinks, and see what actually drove every
            redemption.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-hairline bg-ink p-5"
            >
              <f.icon className="h-5 w-5 text-amber" />
              <h3 className="mt-3 text-sm font-semibold text-cream">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-cream2">{f.body}</p>
            </motion.div>
          ))}
        </div>

        <Link
          href="/venues"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink outline-none transition-all hover:bg-amber-soft focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ink2"
        >
          register venue interest
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

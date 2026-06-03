"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"

const stack = [
  { item: "Pre-buy drinks at up to 40% off", value: "save £££ a night" },
  { item: "Live flash deals all night long", value: "members only" },
  { item: "Skip-the-queue redemption at the bar", value: "your time back" },
  { item: "Live map of what's on tonight", value: "never guess again" },
  { item: "One-tap plans for the whole group", value: "no more chaos" },
  { item: "First dibs on Manchester launch venues", value: "early access" },
]

export function ValueStack() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-flame">
            here&apos;s everything you get
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            all of it. <span className="text-flame">none of the catch.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-hairline bg-ink2"
        >
          <ul className="divide-y divide-hairline">
            {stack.map((row) => (
              <li
                key={row.item}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <span className="flex items-center gap-3 text-sm text-cream sm:text-base">
                  <Check className="h-5 w-5 shrink-0 text-flame" />
                  {row.item}
                </span>
                <span className="shrink-0 text-xs font-medium text-amber sm:text-sm">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-1 border-t border-hairline bg-flame/5 px-6 py-8 text-center">
            <span className="text-sm uppercase tracking-wider text-mute">
              your price today
            </span>
            <span className="font-display text-5xl font-bold lowercase text-flame">
              free
            </span>
            <span className="mt-1 text-sm text-cream2">
              free to download. free to use. you only pay for the drinks you
              choose — at a discount.
            </span>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-cream2">
            <span className="font-semibold text-cream">Manchester first.</span>{" "}
            Early-access spots are limited while we onboard launch venues.
          </p>
          <Link
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-flame px-7 py-3.5 text-sm font-semibold text-cream outline-none transition-all hover:bg-flame-soft focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            register interest
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

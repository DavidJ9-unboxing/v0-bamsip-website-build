"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

// PLACEHOLDER testimonials — illustrative of the experience we're building,
// not real user quotes. Replace with verified quotes before public launch.
const testimonials = [
  {
    initial: "M",
    name: "Maya",
    detail: "Northern Quarter regular",
    quote:
      "Pre-bought a round before we even left the flat. Walked straight to the bar, tapped, done. Felt like cheating.",
  },
  {
    initial: "J",
    name: "Jordan",
    detail: "out most Fridays",
    quote:
      "A flash deal popped up two streets away and we just went. Best spontaneous night we've had in ages.",
  },
  {
    initial: "P",
    name: "Priya",
    detail: "always plans the group",
    quote:
      "Shared the whole night to the group chat in one tap. For once nobody argued about where to go.",
  },
]

export function Testimonials() {
  return (
    <section className="border-y border-hairline bg-ink2 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-flame">
            the word on the street
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            nights that just <span className="text-flame">work.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-hairline bg-ink p-6"
            >
              <Quote className="h-7 w-7 text-flame/40" />
              <div className="mt-3 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber text-amber" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-cream2">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-flame/15 font-display text-base font-semibold text-flame">
                  {t.initial}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-cream">
                    {t.name}
                  </span>
                  <span className="block text-xs text-mute">{t.detail}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-mute">
          {/* Honesty note — pre-launch */}
          Illustrative of the BamSip experience. Verified user reviews land at
          Manchester launch.
        </p>
      </div>
    </section>
  )
}

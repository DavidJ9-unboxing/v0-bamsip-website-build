"use client"

import { motion } from "framer-motion"
import { Zap, Heart, PiggyBank, Check } from "lucide-react"

const columns = [
  {
    icon: Zap,
    kicker: "functional",
    title: "the whole night, handled",
    points: [
      "live map of the best deals near you now",
      "events & bammer-only nights when you want them",
      "pre-buy your drinks before you head out",
      "share the plan to the group in one tap",
    ],
  },
  {
    icon: Heart,
    kicker: "emotional",
    title: "the night everyone remembers",
    points: [
      "always know where the night's at",
      "more time with mates, less faffing",
      "be the friend with the plan, every time",
      "first to the gigs and themed nights too",
    ],
  },
  {
    icon: PiggyBank,
    kicker: "financial",
    title: "spend less, do more",
    points: [
      "save up to 40% pre-buying drinks",
      "member pricing on event tickets",
      "no booking fees, no catch",
      "free to download, free to use",
    ],
  },
]

export function BenefitsTriad() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-flame">
            this is the fix
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            one app for the night you actually wanted.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((col, i) => (
            <motion.div
              key={col.kicker}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-hairline bg-ink2 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-flame/10 text-flame">
                <col.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-amber">
                {col.kicker}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-balance text-cream">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-cream2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-flame" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Beer, Store } from "lucide-react"

const cards = [
  {
    href: "/bammers",
    label: "For Bammers",
    icon: Beer,
    accent: "flame" as const,
    lines: ["pre-buy drinks.", "skip the hassle.", "find the night."],
  },
  {
    href: "/venues",
    label: "For Venues",
    icon: Store,
    accent: "amber" as const,
    lines: ["fill dead nights.", "protect margin.", "see what worked."],
  },
]

export function SplitChooser() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {cards.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={card.href} className="group block h-full">
              <div
                className={`relative h-full overflow-hidden rounded-3xl border bg-ink2 p-8 transition-all duration-300 hover:-translate-y-1 ${
                  card.accent === "flame"
                    ? "border-flame/25 hover:border-flame/60 hover:shadow-[0_0_50px_-12px_rgba(255,107,84,0.4)]"
                    : "border-amber/25 hover:border-amber/60 hover:shadow-[0_0_50px_-12px_rgba(255,181,71,0.35)]"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      card.accent === "flame"
                        ? "bg-flame/15 text-flame"
                        : "bg-amber/15 text-amber"
                    }`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                      card.accent === "flame" ? "text-flame" : "text-amber"
                    }`}
                  />
                </div>
                <h3 className="font-display text-2xl font-bold text-cream">
                  {card.label}
                </h3>
                <ul className="mt-4 space-y-1.5">
                  {card.lines.map((line) => (
                    <li key={line} className="text-cream2">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

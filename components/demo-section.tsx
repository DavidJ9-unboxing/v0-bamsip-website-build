"use client"

import { motion } from "framer-motion"
import { Compass, Wallet, Smartphone } from "lucide-react"
import { PhoneDemo } from "./phone-demo"

const points = [
  {
    icon: Compass,
    title: "discover what's live",
    body: "open the map, filter by vibe, see every deal dropping near you right now.",
  },
  {
    icon: Wallet,
    title: "pre-buy before you arrive",
    body: "lock in cocktails at The Salford Distillery before you leave the house.",
  },
  {
    icon: Smartphone,
    title: "tap to redeem",
    body: "hold your phone to the reader at the bar. sorted. show the bar.",
  },
]

export function DemoSection() {
  return (
    <section id="demo" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-flame">
            the app
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            have a play. it&apos;s the real thing.
          </h2>
          <p className="mt-3 text-cream2">
            tap through the journey — home, map, a venue, pre-buy, then redeem at
            the bar.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:order-2"
          >
            <PhoneDemo />
          </motion.div>

          <div className="space-y-6 lg:order-1">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame/10 text-flame">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold lowercase text-cream">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-cream2">
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

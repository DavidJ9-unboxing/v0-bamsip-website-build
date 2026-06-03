"use client"

import { motion } from "framer-motion"
import { SignupForm } from "./signup-form"

export function FinalCta() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-t border-hairline px-4 py-20 sm:px-6 lg:px-8"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(255,107,84,0.18), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold lowercase text-balance text-cream sm:text-5xl">
            don&apos;t miss the manchester rollout.
          </h2>
          <p className="mt-4 text-cream2">
            get on the list, or put your venue in front of the city.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-flame/25 bg-ink2 p-6 sm:p-8"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-flame">
              going out?
            </p>
            <h3 className="mb-6 font-display text-xl font-bold lowercase text-cream">
              get early access
            </h3>
            <SignupForm variant="bammer" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-amber/25 bg-ink2 p-6 sm:p-8"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-amber">
              run a venue?
            </p>
            <h3 className="mb-6 font-display text-xl font-bold lowercase text-cream">
              register interest
            </h3>
            <SignupForm variant="venue" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

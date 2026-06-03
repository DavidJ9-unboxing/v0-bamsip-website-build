"use client"

import { motion } from "framer-motion"

interface SocialProofProps {
  variant?: "compact" | "full"
}

export function SocialProof({ variant = "compact" }: SocialProofProps) {
  if (variant === "full") {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ink2">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Quote */}
            <blockquote className="text-xl sm:text-2xl text-cream font-medium leading-relaxed mb-8">
              &ldquo;BamSip is the first tool I&apos;ve seen that actually changes the
              economics for operators. Live offers, real attribution, and venues
              stay in charge of the price floor. We&apos;re behind it.&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-ink3 flex items-center justify-center">
                <span className="text-2xl font-bold text-flame">SL</span>
              </div>
              <div className="text-center">
                <p className="text-cream font-semibold">Sacha Lord</p>
                <p className="text-mute text-sm">
                  President, UK Night Time Industries Association
                </p>
                <p className="text-flame text-xs mt-1">10% Shareholder</p>
              </div>
            </div>

            {/* NTIA Logo placeholder */}
            <div className="mt-12 pt-8 border-t border-hairline">
              <p className="text-xs text-mute uppercase tracking-wider mb-4">
                Backed by
              </p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="text-cream font-bold">NTIA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Compact variant for Bammers page
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ink2">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-cream2 text-sm sm:text-base">
            Built with{" "}
            <span className="text-cream font-semibold">Sacha Lord</span> —
            President of the{" "}
            <span className="text-cream font-semibold">
              UK Night Time Industries Association
            </span>
            .
          </p>
          <p className="text-mute text-sm">
            Launching Manchester, May 2026 — then Leeds, Liverpool, Birmingham,
            London.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

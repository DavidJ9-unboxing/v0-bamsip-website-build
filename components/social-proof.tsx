"use client"

import { motion } from "framer-motion"
import { MapPin, Users, ShieldCheck } from "lucide-react"

interface SocialProofProps {
  variant?: "compact" | "full"
}

// PLACEHOLDER credibility copy. Sacha Lord / NTIA involvement is NOT confirmed
// and is subject to approval. Replace before any final public launch.
const markers = [
  { icon: MapPin, text: "Manchester rollout now onboarding." },
  { icon: Users, text: "Built with nightlife operators." },
  { icon: ShieldCheck, text: "Sacha Lord & UK NTIA involvement, subject to approval." },
]

export function SocialProof({ variant = "compact" }: SocialProofProps) {
  if (variant === "full") {
    return (
      <section className="bg-ink2 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-3">
            {markers.map((m, i) => (
              <motion.div
                key={m.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl border border-hairline bg-ink px-5 py-4"
              >
                <m.icon className="h-5 w-5 shrink-0 text-flame" />
                <span className="text-sm text-cream2">{m.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Partner / press logo slots */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Partner", "Partner", "Press", "Press"].map((label, i) => (
              <div
                key={i}
                className="flex h-14 items-center justify-center rounded-xl border border-dashed border-hairline text-xs text-mute"
              >
                {label} logo
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Compact strip
  return (
    <section className="bg-ink2 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
        <p className="text-sm text-cream2">
          Manchester rollout now onboarding — built with nightlife operators.
        </p>
        <p className="text-xs text-mute">
          {/* PLACEHOLDER: not confirmed, subject to approval */}
          Sacha Lord &amp; UK Night Time Industries Association involvement,
          subject to approval.
        </p>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { MapPin, Users, ShieldCheck } from "lucide-react"

interface SocialProofProps {
  variant?: "compact" | "full"
}

const markers = [
  { icon: MapPin, text: "Manchester rollout now onboarding." },
  { icon: Users, text: "Built with nightlife operators." },
  { icon: ShieldCheck, text: "Sacha Lord is an advisor to BamSip." },
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
        </div>
      </section>
    )
  }

  // Compact strip
  return (
    <section className="bg-ink2 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
        <p className="text-sm text-cream2">
          Manchester rollout now onboarding. Built with nightlife operators.
        </p>
        <p className="text-xs text-mute">
          Sacha Lord is an advisor to BamSip.
        </p>
      </div>
    </section>
  )
}

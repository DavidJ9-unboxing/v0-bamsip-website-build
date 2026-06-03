"use client"

import { motion } from "framer-motion"
import { MapPin, Users, ShieldCheck } from "lucide-react"

const markers = [
  { icon: MapPin, text: "Manchester rollout now onboarding." },
  { icon: Users, text: "Built with nightlife operators." },
  {
    icon: ShieldCheck,
    // NOTE: Sacha Lord / NTIA involvement is PLACEHOLDER copy pending approval.
    // Do not treat as confirmed or final public messaging.
    text: "Sacha Lord & UK NTIA involvement, subject to approval.",
  },
]

// PLACEHOLDER QUOTE — not approved final public copy. Replace before launch.
const PLACEHOLDER_QUOTE =
  "BamSip gives operators live offers and real attribution while keeping venues in charge of price. That's the right model for nightlife."

export function TrustBand() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-3 sm:grid-cols-3">
          {markers.map((m, i) => (
            <motion.div
              key={m.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl border border-hairline bg-ink2 px-5 py-4"
            >
              <m.icon className="h-5 w-5 shrink-0 text-flame" />
              <span className="text-sm text-cream2">{m.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Placeholder credibility quote */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 rounded-3xl border border-hairline bg-ink2 p-8 text-center"
        >
          <blockquote className="mx-auto max-w-2xl font-display text-xl font-medium text-balance text-cream sm:text-2xl">
            &ldquo;{PLACEHOLDER_QUOTE}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm text-mute">
            Placeholder — pending approval
          </figcaption>
        </motion.figure>

        {/* Partner / press logo slots */}
        <div className="mt-8">
          <p className="text-center text-[11px] uppercase tracking-wider text-mute">
            Venue partners & press
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
      </div>
    </section>
  )
}

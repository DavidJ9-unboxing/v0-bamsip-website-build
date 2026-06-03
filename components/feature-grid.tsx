"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  headline: string
  body: string
}

interface FeatureGridProps {
  features: Feature[]
  sectionLabel?: string
}

export function FeatureGrid({ features, sectionLabel }: FeatureGridProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {sectionLabel && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-flame text-xs font-medium tracking-wider uppercase mb-12 text-center"
          >
            {sectionLabel}
          </motion.p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.headline}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl border border-hairline bg-ink2 hover:border-flame/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-flame/10 flex items-center justify-center mb-4 group-hover:bg-flame/20 transition-colors">
                <feature.icon className="w-6 h-6 text-flame" />
              </div>
              <h3 className="text-lg font-semibold text-cream mb-2">
                {feature.headline}
              </h3>
              <p className="text-cream2 text-sm leading-relaxed">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

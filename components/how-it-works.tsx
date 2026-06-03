"use client"

import { motion } from "framer-motion"

interface Step {
  number: number
  headline: string
  body: string
}

interface HowItWorksProps {
  steps: Step[]
}

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ink">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-flame text-xs font-medium tracking-wider uppercase mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-cream">
            three steps.{" "}
            <span className="text-flame">done.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-flame/20 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl border border-hairline bg-ink2 text-center">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-flame text-cream font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-cream mb-2">
                    {step.headline}
                  </h3>
                  <p className="text-cream2 text-sm leading-relaxed">
                    {step.body}
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

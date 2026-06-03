"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Share2, Users, BadgePoundSterling, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Share2,
    title: "share your link",
    body: "every bammer gets a unique invite link the moment they join.",
  },
  {
    icon: Users,
    title: "50 mates sign up",
    body: "when 50 friends register and confirm through your link, you've hit it.",
  },
  {
    icon: BadgePoundSterling,
    title: "we send you £5",
    body: "paid straight to your PayPal. every 50 mates earns another £5 — no cap.",
  },
]

export function ReferralOffer() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-flame/30 bg-ink2"
        >
          <div className="flex flex-col items-center gap-3 border-b border-hairline bg-flame/5 px-6 py-10 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-flame">
              bring your people
            </span>
            <h2 className="font-display text-3xl font-bold lowercase text-balance text-cream sm:text-4xl">
              get <span className="text-flame">£5 for every 50 mates</span> you
              bring
            </h2>
            <p className="max-w-md text-cream2">
              spread the word and we&apos;ll pay you for it. refer 50 friends who
              join, earn a fiver — do it again, earn another. simple.
            </p>
          </div>

          <ol className="grid gap-px bg-hairline sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 bg-ink2 px-6 py-8 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-flame/10 text-flame">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold lowercase text-cream">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream2">{s.body}</p>
              </motion.li>
            ))}
          </ol>

          <div className="flex flex-col items-center gap-3 border-t border-hairline px-6 py-8 text-center">
            <Link
              href="#waitlist"
              className="inline-flex items-center gap-2 rounded-full bg-flame px-7 py-3.5 text-sm font-semibold text-cream outline-none transition-all hover:bg-flame-soft focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              register & get your link
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-mute">
              your invite link is emailed to you the moment you confirm.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

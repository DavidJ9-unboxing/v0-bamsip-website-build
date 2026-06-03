"use client"

import { motion } from "framer-motion"
import { CalendarX, Wallet, MessageSquare, HelpCircle } from "lucide-react"

const pains = [
  {
    icon: CalendarX,
    title: "you miss the good stuff",
    body: "the deal two streets away, the gig, the night everyone talks about after — you always hear too late.",
  },
  {
    icon: Wallet,
    title: "£14 a cocktail, blind",
    body: "no idea if it's worth it until the card machine beeps. no deals, no warning.",
  },
  {
    icon: MessageSquare,
    title: "group chat chaos",
    body: "\"where are we going?\" x47 messages. nobody decides. the night drifts.",
  },
  {
    icon: HelpCircle,
    title: "you never know the vibe",
    body: "show up and it's dead. or rammed. you find out the hard way, every time.",
  },
]

export function PainPoints() {
  return (
    <section className="border-y border-hairline bg-ink2 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-mute">
            let&apos;s be honest
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            going out got <span className="text-flame">complicated.</span>
          </h2>
          <p className="mt-3 leading-relaxed text-cream2">
            the apps you&apos;ve got book tables and order taxis. none of them
            actually fix the night itself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl border border-hairline bg-ink p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mute/10 text-mute">
                <pain.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold lowercase text-cream">
                  {pain.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-cream2">
                  {pain.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

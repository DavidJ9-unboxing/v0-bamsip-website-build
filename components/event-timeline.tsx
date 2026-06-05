"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

const milestones = [
  {
    when: "July",
    title: "the first night",
    place: "Manchester",
    body: "our launch event kicks off in a Manchester venue. bammer-only, drinks pre-bought, the whole thing sorted.",
    highlight: true,
  },
  {
    when: "Aug",
    title: "summer takeover",
    place: "more nights, more venues",
    body: "additional events roll out across the summer as we bring more Manchester venues on board.",
  },
  {
    when: "Sept",
    title: "gearing up",
    place: "the big push",
    body: "students back, nights drawing in. we ramp up events and open the doors to more bammers.",
  },
  {
    when: "Dec",
    title: "the run into Christmas",
    place: "peak season",
    body: "the busiest nights of the year, fully loaded with deals, gigs and themed events.",
  },
]

export function EventTimeline() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-flame">
            what&apos;s coming
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            it starts in <span className="text-flame">Manchester this July.</span>
          </h2>
          <p className="mt-4 text-cream2">
            one launch night, then a summer of events as we build to September
            and the run into Christmas.
          </p>
        </motion.div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <motion.li
              key={m.when}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-5 ${
                m.highlight
                  ? "border-flame/40 bg-flame/5"
                  : "border-hairline bg-ink2"
              }`}
            >
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 font-display text-sm font-bold ${
                  m.highlight
                    ? "bg-flame text-cream"
                    : "border border-hairline bg-ink text-cream2"
                }`}
              >
                {m.when}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold lowercase text-cream">
                {m.title}
              </h3>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-amber">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {m.place}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-cream2">{m.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import {
  Music,
  Wine,
  GraduationCap,
  Users,
  TrendingUp,
  CalendarCheck2,
  Ticket,
  ShieldCheck,
} from "lucide-react"

type Accent = "flame" | "amber"

const accentMap = {
  flame: {
    text: "text-flame",
    border: "border-flame/40",
    bgSoft: "bg-flame/5",
    chipBg: "bg-flame/10",
    chipText: "text-flame",
    dot: "bg-flame",
  },
  amber: {
    text: "text-amber",
    border: "border-amber/40",
    bgSoft: "bg-amber/5",
    chipBg: "bg-amber/10",
    chipText: "text-amber",
    dot: "bg-amber",
  },
} as const

// Concrete sample nights — placeholder copy venues/bammers can relate to.
const sampleEvents = [
  {
    icon: Music,
    name: "Northern Quarter Live Sessions",
    cadence: "every other Friday",
    blurb:
      "a rotating line-up of Manchester's best up-and-coming acts, with a pre-bought drinks bundle on arrival.",
    venueWin: "pre-sold 120-cap room",
    bammerWin: "early-access tickets + member pricing",
  },
  {
    icon: Wine,
    name: "Cocktail Masterclass & Late",
    cadence: "monthly, midweek",
    blurb:
      "a hands-on masterclass with the bar team, then the room turns into the night — drinks deals run till close.",
    venueWin: "fills a dead Tuesday",
    bammerWin: "two cocktails made + kept",
  },
  {
    icon: GraduationCap,
    name: "Student Takeover Thursdays",
    cadence: "term-time weekly",
    blurb:
      "a bammer-only student night with capped deals, a DJ, and group plans built straight into the app.",
    venueWin: "guaranteed term-time footfall",
    bammerWin: "save up to 40% with mates",
  },
]

const venueWins = [
  {
    icon: CalendarCheck2,
    title: "guaranteed bookings",
    body: "tickets and drinks bundles are pre-sold before the doors open — the night is funded before it starts.",
  },
  {
    icon: TrendingUp,
    title: "revenue you can forecast",
    body: "a planned calendar of bammer nights turns your quietest windows into reliable, repeatable income.",
  },
]

const bammerWins = [
  {
    icon: Ticket,
    title: "a night worth planning for",
    body: "curated line-ups, themed rooms and member-only deals — not just whatever's open on the night.",
  },
  {
    icon: ShieldCheck,
    title: "an almost-guaranteed good one",
    body: "the venue's sorted, your drinks are pre-bought, your mates are in. you just turn up and enjoy it.",
  },
]

export function PlannedEvents({ accent = "flame" }: { accent?: Accent }) {
  const a = accentMap[accent]

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className={`text-xs font-medium uppercase tracking-wider ${a.text}`}>
            planned bammer events
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
            the nights everyone wins.
          </h2>
          <p className="mt-4 text-cream2">
            curated, recurring nights built with our venues — pre-sold so the bar
            fills, and locked-in so the night lands. revenue for the venue, a
            near-guaranteed great time for the bammers.
          </p>
        </motion.div>

        {/* Win-win split */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-amber/30 bg-amber/5 p-6"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              <p className="text-xs font-medium uppercase tracking-wider text-amber">
                for venues
              </p>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold text-cream">
              revenue you can plan around.
            </h3>
            <ul className="mt-5 space-y-5">
              {venueWins.map((w) => (
                <li key={w.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-cream">
                      {w.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-cream2">
                      {w.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-flame/30 bg-flame/5 p-6"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-flame" />
              <p className="text-xs font-medium uppercase tracking-wider text-flame">
                for bammers
              </p>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold text-cream">
              a great night, near-guaranteed.
            </h3>
            <ul className="mt-5 space-y-5">
              {bammerWins.map((w) => (
                <li key={w.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flame/10 text-flame">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-cream">
                      {w.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-cream2">
                      {w.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Concrete sample nights */}
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <Users className={`h-4 w-4 ${a.text}`} />
            <p className="text-sm font-medium text-cream2">
              a taste of what&apos;s on the calendar
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {sampleEvents.map((ev, i) => (
              <motion.article
                key={ev.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col rounded-2xl border ${a.border} ${a.bgSoft} p-5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.chipBg} ${a.chipText}`}
                  >
                    <ev.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-hairline bg-ink px-3 py-1 text-xs text-cream2">
                    {ev.cadence}
                  </span>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold text-balance text-cream">
                  {ev.name}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-cream2">
                  {ev.blurb}
                </p>
                <div className="mt-4 grid gap-2 border-t border-hairline pt-4">
                  <div className="flex items-center gap-2 text-xs text-cream2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                    <span className="font-medium text-cream">venue:</span>
                    {ev.venueWin}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cream2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flame" />
                    <span className="font-medium text-cream">bammer:</span>
                    {ev.bammerWin}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

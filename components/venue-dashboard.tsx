"use client"

import { motion } from "framer-motion"
import { TrendingUp, Banknote, Ticket, Users, Zap } from "lucide-react"

// Deterministic mock data — never randomised, so it stays stable on refresh.
const footfall = [
  { hour: "6", value: 12 },
  { hour: "7", value: 20 },
  { hour: "8", value: 34 },
  { hour: "9", value: 58 },
  { hour: "10", value: 76 },
  { hour: "11", value: 92 },
  { hour: "12", value: 64 },
  { hour: "1", value: 38 },
]
const peak = Math.max(...footfall.map((f) => f.value))

const stats = [
  { icon: Ticket, label: "Redemptions", value: "318", delta: "+42 vs last Tue" },
  { icon: Banknote, label: "Revenue", value: "£4,920", delta: "+£1,310 attributed" },
  { icon: Users, label: "Footfall", value: "451", delta: "peak 11pm" },
]

export function VenueDashboard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-hairline bg-ink2 p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:p-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-mute">The Salford Distillery</p>
          <h3 className="font-display text-lg font-bold text-cream">
            Tonight&apos;s performance
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Offer live
          </span>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-flame px-4 py-1.5 text-xs font-semibold text-cream">
            <Zap className="h-3.5 w-3.5" />
            Push Live
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-hairline bg-ink p-4"
          >
            <div className="flex items-center gap-2 text-mute">
              <s.icon className="h-4 w-4" />
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-cream">
              {s.value}
            </p>
            <p className="text-[11px] text-success">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        {/* Footfall by hour */}
        <div className="rounded-2xl border border-hairline bg-ink p-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs text-cream2">
              <TrendingUp className="h-3.5 w-3.5 text-flame" /> Footfall by hour
            </p>
            <span className="text-[11px] text-mute">6pm – 1am</span>
          </div>
          <div className="mt-4 flex h-32 items-end justify-between gap-1.5">
            {footfall.map((f, i) => (
              <div key={f.hour} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(f.value / peak) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`w-full rounded-t-md ${
                    f.value === peak ? "bg-flame" : "bg-flame/35"
                  }`}
                  style={{ minHeight: 4 }}
                />
                <span className="text-[9px] text-mute">{f.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Offer studio */}
        <div className="rounded-2xl border border-hairline bg-ink p-4 lg:col-span-2">
          <p className="text-xs text-cream2">Offer studio</p>
          <div className="mt-3 rounded-xl border border-flame/30 bg-flame/5 p-3">
            <p className="text-sm font-semibold text-cream">2-4-1 cocktails</p>
            <p className="text-[11px] text-mute">6pm–9pm · capped at 80</p>
          </div>
          <div className="mt-3 space-y-2 text-[11px]">
            <Control label="Discount" value="50%" />
            <Control label="Cap" value="80 redemptions" />
            <Control label="Window" value="6:00 – 9:00pm" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Control({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-ink2 px-3 py-2">
      <span className="text-mute">{label}</span>
      <span className="font-medium text-cream">{value}</span>
    </div>
  )
}

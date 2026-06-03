import { requireAdmin } from "@/lib/admin"
import {
  getDashboardStats,
  getSignupTrend,
  getTasteBreakdown,
} from "@/app/actions/admin"
import { StatCard } from "@/components/admin/stat-card"
import { BreakdownChart, TrendChart } from "@/components/admin/insight-charts"
import { Users, Store, PoundSterling, MessageSquare } from "lucide-react"

export default async function AdminDashboard() {
  await requireAdmin()
  const [stats, trend, breakdown] = await Promise.all([
    getDashboardStats(),
    getSignupTrend(),
    getTasteBreakdown(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-cream">Overview</h1>
        <p className="mt-1 text-sm text-mute">
          Track interest, taste insights and referral payouts as launch builds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Bammers registered"
          value={stats.bammers.total}
          sub={`${stats.bammers.confirmed} confirmed · ${stats.bammers.pending} pending`}
          icon={Users}
        />
        <StatCard
          label="SMS opt-ins"
          value={stats.bammers.smsOptIn}
          sub="can receive texts"
          icon={MessageSquare}
          accent="amber"
        />
        <StatCard
          label="Venues interested"
          value={stats.venues.total}
          sub={`${stats.venues.confirmed} confirmed`}
          icon={Store}
          accent="amber"
        />
        <StatCard
          label="Payouts owed"
          value={`£${stats.payouts.owed ? stats.payouts.owedAmount : 0}`}
          sub={`£${stats.payouts.paidAmount} paid to date`}
          icon={PoundSterling}
          accent="success"
        />
      </div>

      <div className="rounded-2xl border border-hairline bg-ink2 p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-cream">
          Bammer signups over time
        </h2>
        <TrendChart data={trend} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-cream">
            What bammers want
          </h2>
          <p className="mb-4 text-xs text-mute">Their go-to night out</p>
          <BreakdownChart data={breakdown.vibes} />
        </div>
        <div className="rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-cream">
            What they're hoping to get
          </h2>
          <p className="mb-4 text-xs text-mute">Top motivation from BamSip</p>
          <BreakdownChart data={breakdown.motivations} />
        </div>
      </div>

      <div className="rounded-2xl border border-hairline bg-ink2 p-5">
        <h2 className="mb-1 font-display text-lg font-semibold text-cream">
          What venues want
        </h2>
        <p className="mb-4 text-xs text-mute">Their primary goal with BamSip</p>
        <BreakdownChart data={breakdown.venueGoals} />
      </div>
    </div>
  )
}

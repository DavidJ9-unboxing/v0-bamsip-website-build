import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import {
  getDashboardStats,
  getSignupTrend,
  getTasteBreakdown,
} from "@/app/actions/admin"
import { getVisitStats } from "@/app/actions/analytics"
import { StatCard } from "@/components/admin/stat-card"
import { BreakdownChart, TrendChart } from "@/components/admin/insight-charts"
import {
  Users,
  Store,
  PoundSterling,
  MessageSquare,
  Eye,
  UserCheck,
  ArrowRight,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  await requireAdmin()
  const [stats, trend, breakdown, visits] = await Promise.all([
    getDashboardStats(),
    getSignupTrend(),
    getTasteBreakdown(),
    getVisitStats(30),
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

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-cream">
            Site traffic
            <span className="ml-2 text-xs font-normal text-mute">
              last 30 days
            </span>
          </h2>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-1 text-sm text-flame transition-colors hover:text-flame/80"
          >
            Full analytics
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Page views"
            value={visits.views.toLocaleString()}
            sub={`${visits.viewsChange >= 0 ? "+" : ""}${visits.viewsChange}% vs prev 30 days`}
            icon={Eye}
          />
          <StatCard
            label="Unique visitors"
            value={visits.visitors.toLocaleString()}
            sub={`${visits.visitorsChange >= 0 ? "+" : ""}${visits.visitorsChange}% vs prev 30 days`}
            icon={UserCheck}
            accent="amber"
          />
          <StatCard
            label="Views / visitor"
            value={visits.perVisitor}
            sub="avg pages per visitor"
            icon={Users}
            accent="success"
          />
        </div>
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

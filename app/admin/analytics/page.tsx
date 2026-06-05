import { requireAdmin } from "@/lib/admin"
import {
  getVisitStats,
  getVisitTrend,
  getTopPages,
  getReferrers,
  getDeviceBreakdown,
  getGeoBreakdown,
  type AnalyticsRange,
} from "@/app/actions/analytics"
import { StatCard } from "@/components/admin/stat-card"
import {
  BreakdownChart,
  VisitsTrendChart,
} from "@/components/admin/insight-charts"
import { RangeTabs } from "@/components/admin/range-tabs"
import { Eye, Users, MousePointerClick, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

function parseRange(value?: string): AnalyticsRange {
  const n = Number(value)
  return n === 7 || n === 90 ? n : 30
}

function changeLabel(pct: number) {
  if (pct === 0) return "no change vs prev period"
  const dir = pct > 0 ? "↑" : "↓"
  return `${dir} ${Math.abs(pct)}% vs prev period`
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  await requireAdmin()
  const { range: rangeParam } = await searchParams
  const range = parseRange(rangeParam)

  const [stats, trend, topPages, referrers, devices, geo] = await Promise.all([
    getVisitStats(range),
    getVisitTrend(range),
    getTopPages(range),
    getReferrers(range),
    getDeviceBreakdown(range),
    getGeoBreakdown(range),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">
            Site analytics
          </h1>
          <p className="mt-1 text-sm text-mute">
            First-party visit metrics for bamsip.com — privacy-friendly, no
            cookies shared with third parties.
          </p>
        </div>
        <RangeTabs current={range} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Page views"
          value={stats.views.toLocaleString()}
          sub={changeLabel(stats.viewsChange)}
          icon={Eye}
        />
        <StatCard
          label="Unique visitors"
          value={stats.visitors.toLocaleString()}
          sub={changeLabel(stats.visitorsChange)}
          icon={Users}
          accent="amber"
        />
        <StatCard
          label="Views / visitor"
          value={stats.perVisitor}
          sub="avg pages per visitor"
          icon={MousePointerClick}
          accent="success"
        />
        <StatCard
          label="Top source"
          value={referrers[0] ? referrers[0].label : "—"}
          sub={
            referrers[0]
              ? `${referrers[0].count.toLocaleString()} views`
              : "no traffic yet"
          }
          icon={TrendingUp}
        />
      </div>

      <div className="rounded-2xl border border-hairline bg-ink2 p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-cream">
          Visits over time
        </h2>
        <VisitsTrendChart data={trend} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-cream">
            Top pages
          </h2>
          <p className="mb-4 text-xs text-mute">Most viewed pages</p>
          <BreakdownChart data={topPages} />
        </div>
        <div className="rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-cream">
            Traffic sources
          </h2>
          <p className="mb-4 text-xs text-mute">Where visitors come from</p>
          <BreakdownChart data={referrers} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-cream">
            Devices
          </h2>
          <p className="mb-4 text-xs text-mute">Mobile vs desktop vs tablet</p>
          <BreakdownChart data={devices} />
        </div>
        <div className="rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-cream">
            Top countries
          </h2>
          <p className="mb-4 text-xs text-mute">Visits by location</p>
          <BreakdownChart data={geo} />
        </div>
      </div>
    </div>
  )
}

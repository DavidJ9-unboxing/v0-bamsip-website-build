"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Area,
  AreaChart,
  Tooltip,
} from "recharts"

const PALETTE = ["#FF6B54", "#FFB547", "#34D399", "#FF8A78", "#FFC97A", "#7C3AED"]

const LABELS: Record<string, string> = {
  "big-energy": "Big energy / clubs",
  "chilled-bars": "Chilled bars",
  "live-music": "Live music & gigs",
  "food-drinks": "Food & drinks",
  surprise: "Surprise me",
  weekly: "Weekly",
  "few-times-month": "A few times / month",
  monthly: "Monthly",
  occasionally: "Occasionally",
  "save-money": "Save money",
  "discover-places": "Discover places",
  "plan-friends": "Plan with friends",
  "events-gigs": "Events & gigs",
  "fill-quiet": "Fill quiet nights",
  "new-customers": "New customers",
  "promote-events": "Promote events",
  "boost-midweek": "Boost midweek",
  data: "Customer insight",
  unknown: "Not specified",
}

function pretty(label: string) {
  return LABELS[label] ?? label
}

export function BreakdownChart({
  data,
}: {
  data: { label: string; count: number }[]
}) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: pretty(d.label), count: d.count }))

  if (!chartData.length) {
    return (
      <p className="py-8 text-center text-sm text-mute">No data yet.</p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 44)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fill: "#9A9AA8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            background: "#1C1C24",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "#fff",
          }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TrendChart({
  data,
}: {
  data: { day: string; count: number }[]
}) {
  if (!data.length) {
    return <p className="py-8 text-center text-sm text-mute">No signups yet.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="flameFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B54" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FF6B54" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fill: "#9A9AA8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis
          tick={{ fill: "#9A9AA8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            background: "#1C1C24",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "#fff",
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#FF6B54"
          strokeWidth={2}
          fill="url(#flameFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

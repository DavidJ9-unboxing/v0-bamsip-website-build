import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "flame",
}: {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  accent?: "flame" | "amber" | "success"
}) {
  const accentClass =
    accent === "amber"
      ? "bg-amber/15 text-amber"
      : accent === "success"
        ? "bg-success/15 text-success"
        : "bg-flame/15 text-flame"

  return (
    <div className="rounded-2xl border border-hairline bg-ink2 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-mute">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold text-cream">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-mute">{sub}</p>}
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  )
}

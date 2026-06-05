import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  confirmed: "bg-success/15 text-success",
  pending: "bg-amber/15 text-amber",
  unsubscribed: "bg-mute/15 text-mute",
  owed: "bg-amber/15 text-amber",
  paid: "bg-success/15 text-success",
  failed: "bg-error/15 text-error",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STYLES[status] ?? "bg-ink3 text-cream2",
      )}
    >
      {status}
    </span>
  )
}

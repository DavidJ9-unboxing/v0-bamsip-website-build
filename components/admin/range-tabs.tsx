"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
]

export function RangeTabs({ current }: { current: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const select = (value: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("range", String(value))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-hairline bg-ink2 p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => select(o.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm transition-colors",
            current === o.value
              ? "bg-flame/15 text-flame"
              : "text-cream2 hover:bg-ink3 hover:text-cream",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

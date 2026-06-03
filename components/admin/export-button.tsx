"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { exportCsv } from "@/app/actions/admin"

export function ExportButton({
  kind,
}: {
  kind: "bammers" | "venues" | "payouts"
}) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const csv = await exportCsv(kind)
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bamsip-${kind}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-2 text-sm text-cream2 transition-colors hover:bg-ink3 hover:text-cream disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  )
}

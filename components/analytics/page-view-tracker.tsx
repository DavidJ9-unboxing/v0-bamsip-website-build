"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * First-party page-view tracker. Fires a lightweight beacon to /api/track on
 * the initial load and on every client-side navigation. The external referrer
 * is only sent on the first view of the session (subsequent navigations are
 * internal). All enrichment (device, country, visitor id) happens server-side.
 */
export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    // Skip admin pages entirely on the client too.
    if (pathname.startsWith("/admin")) return

    const referrer = isFirst.current ? document.referrer || "" : ""
    isFirst.current = false

    const payload = JSON.stringify({ path: pathname, referrer })

    // Prefer sendBeacon so it survives navigations; fall back to fetch.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([payload], { type: "application/json" }),
        )
      } else {
        void fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        })
      }
    } catch {
      // tracking must never break the page
    }
    // re-run when the path or query changes
  }, [pathname, searchParams])

  return null
}

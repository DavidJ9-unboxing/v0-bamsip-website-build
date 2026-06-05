"use client"

import { useEffect } from "react"

/**
 * Backstop cleanup for a stale service worker shipped by an older version of the
 * site. That worker cached a blank app shell, which is why some returning visitors
 * saw a blank screen on first load (and content only after a refresh).
 *
 * This component runs after the page renders and removes any leftover service
 * worker registrations and their caches. The site no longer uses a service worker,
 * so this is purely cleanup and safe to keep deployed.
 */
export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        if (registrations.length === 0) return

        // Remove every registered service worker.
        registrations.forEach((registration) => {
          registration.unregister()
        })

        // Clear any caches those workers created.
        if (typeof caches !== "undefined") {
          caches
            .keys()
            .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  return null
}

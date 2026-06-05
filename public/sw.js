// Kill-switch service worker.
// An older version of this site registered a service worker that cached a stale
// app shell, causing a blank screen on first load (content only appearing after a
// refresh). Browsers automatically re-fetch this file (/sw.js), so shipping this
// self-destructing version replaces the old worker, wipes its caches, and reloads
// every controlled tab with fresh content. Keep this file deployed indefinitely so
// any returning visitor still carrying the old worker gets cleaned up.

self.addEventListener("install", () => {
  // Activate immediately instead of waiting for existing tabs to close.
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete every cache the old worker created.
      try {
        const keys = await caches.keys()
        await Promise.all(keys.map((key) => caches.delete(key)))
      } catch (err) {
        // Ignore — cache cleanup is best-effort.
      }

      // Remove this service worker entirely.
      try {
        await self.registration.unregister()
      } catch (err) {
        // Ignore.
      }

      // Force every controlled tab to reload from the network now that there is
      // no worker intercepting requests.
      try {
        const clientList = await self.clients.matchAll({ type: "window" })
        for (const client of clientList) {
          client.navigate(client.url)
        }
      } catch (err) {
        // Ignore.
      }
    })(),
  )
})

// Pass requests straight through to the network (no cache interception) during the
// brief window before this worker finishes unregistering.
self.addEventListener("fetch", () => {})

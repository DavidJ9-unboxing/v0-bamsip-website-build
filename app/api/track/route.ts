import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { randomUUID } from "crypto"
import { db } from "@/lib/db"
import { pageViews } from "@/lib/db/schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const VISITOR_COOKIE = "bs_vid"
// rotate the anonymous visitor id roughly daily for unique-visitor estimates
const VISITOR_MAX_AGE = 60 * 60 * 24 // 1 day in seconds

function detectDevice(ua: string): string {
  const s = ua.toLowerCase()
  if (!s) return "unknown"
  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly/.test(s))
    return "bot"
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return "tablet"
  if (
    /mobi|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini|windows phone/.test(
      s,
    )
  )
    return "mobile"
  return "desktop"
}

function hostFromReferrer(referrer: string | null): string | null {
  if (!referrer) return null
  try {
    return new URL(referrer).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      path?: string
      referrer?: string
    }

    const path = (body.path || "/").slice(0, 512)

    // Don't track the admin area or API/asset noise.
    if (
      path.startsWith("/admin") ||
      path.startsWith("/api") ||
      path.startsWith("/_next")
    ) {
      return new NextResponse(null, { status: 204 })
    }

    const h = await headers()
    const ua = h.get("user-agent") ?? ""
    const device = detectDevice(ua)

    // Skip obvious bots so analytics reflect real humans.
    if (device === "bot") {
      return new NextResponse(null, { status: 204 })
    }

    const country =
      h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? null

    // Treat our own domain as "direct", keep external referrers only.
    const host = h.get("host") ?? ""
    const referrer = body.referrer || null
    let referrerHost = hostFromReferrer(referrer)
    if (referrerHost && host && referrerHost === host.replace(/^www\./, "")) {
      referrerHost = null
    }

    // Anonymous, rotating visitor id in a first-party cookie (no PII / no IP).
    const cookieStore = await cookies()
    let visitorId = cookieStore.get(VISITOR_COOKIE)?.value
    if (!visitorId) {
      visitorId = randomUUID()
      cookieStore.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: VISITOR_MAX_AGE,
        path: "/",
      })
    }

    await db.insert(pageViews).values({
      path,
      visitorId,
      referrer: referrer ? referrer.slice(0, 1024) : null,
      referrerHost: referrerHost ? referrerHost.slice(0, 255) : null,
      device,
      country: country ? country.slice(0, 8) : null,
    })

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.log("[v0] /api/track error:", (err as Error).message)
    // Never let tracking failures surface to visitors.
    return new NextResponse(null, { status: 204 })
  }
}

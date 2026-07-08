"use server"

import { db } from "@/lib/db"
import { venueDirectory, venueSignups } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { getAdminSession } from "@/lib/admin"
import { sendEmail } from "@/lib/messaging"
import {
  applyVenueTokens,
  buildVenueEmailHtml,
  type VenueEmailContent,
} from "@/lib/email-templates"
import { resolveTailoring } from "@/lib/data/venue-tailoring"

async function assertAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
}

/** Resolved per-venue tailoring surfaced to the composer UI. */
export type VenueTailoringInfo = {
  hook: string
  heroImage: string
  heroAlt: string
  subject?: string
}

/** Admin-authored override for a single venue. Supersedes the master template. */
export type VenueOverride = {
  subject?: string
  body?: string
  heroUrl?: string
}

export type EmailableVenue = {
  key: string // "directory:12" | "signup:5"
  source: "directory" | "signup"
  id: number
  venueName: string
  contactName: string
  email: string
  status: string
  category: string | null
  // Pre-computed display order (1 = highest). Signups sort to the top.
  priority: number
  // Priority tier: "A" | "B" | "C" (null = lower/untiered).
  tier: string | null
  confidence: string | null
  // false = no valid email; Send/Resend is disabled and it's excluded from bulk.
  emailable: boolean
  // Outreach tracking, persisted on the directory row.
  timesSent: number
  lastSentAt: string | null
  // Curated per-venue tailoring (hook + custom hero), null when not tailored.
  tailoring: VenueTailoringInfo | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Origin used to make hero image paths absolute for email clients.
 *
 * Real (and test) emails must reference images from a stable, publicly
 * reachable host. The production marketing domain is the durable default —
 * once this branch is merged, it serves the regenerated hero PNGs. For
 * ad-hoc preview testing against a specific (public) deployment, set
 * EMAIL_ASSET_ORIGIN to that deployment's origin, e.g.
 * `https://my-branch.vercel.app`.
 */
function resolveSiteOrigin() {
  const override = process.env.EMAIL_ASSET_ORIGIN?.trim()
  if (override) return override.replace(/\/+$/, "")
  return "https://www.bamsip.com"
}

const SITE_ORIGIN = resolveSiteOrigin()

/**
 * Cache-busting version for hero images. Email clients (Gmail, Outlook, etc.)
 * aggressively cache images by URL, so a recipient who received an earlier send
 * keeps seeing the OLD hero even after we regenerate the PNG at the same path.
 * Bump this whenever the baked hero design changes to force every inbox — even
 * previously-contacted ones like the founder's — to refetch the new image.
 */
const HERO_ASSET_VERSION = "2"

/** Appends the asset version as a query param, preserving any existing query. */
function withHeroVersion(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${HERO_ASSET_VERSION}`
}

/** Turns a /public-relative hero path into an absolute, cache-busted URL. */
function absoluteHero(path: string) {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return withHeroVersion(path)
  return withHeroVersion(`${SITE_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`)
}

/**
 * Builds the final subject + HTML for one recipient. Precedence:
 *   subject: override → tailored subject → master subject
 *   hero:    override → tailored hero → master hero
 *   body:    override → master body (with {{hook}} woven in)
 * The {{hook}} token resolves to this venue's curated hook, or collapses away.
 */
function renderForVenue(args: {
  masterSubject: string
  masterContent: VenueEmailContent
  vars: { venueName: string; contactName: string }
  source: "directory" | "signup"
  id: number
  override?: VenueOverride
  // Sent emails need absolute hero URLs; the in-app preview wants relative ones
  // so images load from the running app instead of the (not-yet-deployed) site.
  absolute?: boolean
}) {
  const t = args.source === "directory" ? resolveTailoring(args.id) : undefined
  const o = args.override
  const hero = args.absolute === false ? (p: string) => p : absoluteHero

  let subject = args.masterSubject
  if (t?.subject) subject = t.subject
  if (o?.subject?.trim()) subject = o.subject

  let content = args.masterContent
  if (content.mode === "template") {
    const heroUrl = o?.heroUrl?.trim()
      ? hero(o.heroUrl.trim())
      : t?.isTailored
        ? hero(t.heroImage)
        : hero(content.heroUrl ?? "")
    content = {
      ...content,
      heroUrl,
      body: o?.body?.trim() ? o.body : content.body,
    }
  }

  const vars = { ...args.vars, hook: t?.hook ?? "" }
  return {
    subject: applyVenueTokens(subject, vars),
    html: applyVenueTokens(buildVenueEmailHtml(content), vars),
  }
}

/**
 * Returns every venue in the directory plus venues that submitted the signup
 * form. Rows flagged `emailable: false` (no valid email) are kept but marked so
 * the UI can disable sending and exclude them from bulk. Emailable duplicates
 * (same email) are collapsed to a single recipient (preferring the record with
 * the richer contact name) so nobody is double-sent.
 *
 * Ordering is by the pre-computed `priority` field (1 = highest); signups sort
 * to the very top. We never re-derive the order.
 */
export async function getEmailableVenues(): Promise<EmailableVenue[]> {
  await assertAdmin()

  const [dir, signs] = await Promise.all([
    db
      .select({
        id: venueDirectory.id,
        name: venueDirectory.name,
        owner: venueDirectory.owner,
        email: venueDirectory.email,
        status: venueDirectory.status,
        category: venueDirectory.category,
        priority: venueDirectory.priority,
        tier: venueDirectory.tier,
        confidence: venueDirectory.confidence,
        emailable: venueDirectory.emailable,
        timesSent: venueDirectory.timesSent,
        lastSentAt: venueDirectory.lastSentAt,
      })
      .from(venueDirectory)
      .orderBy(venueDirectory.priority),
    db
      .select({
        id: venueSignups.id,
        venueName: venueSignups.venueName,
        contactName: venueSignups.contactName,
        email: venueSignups.email,
        status: venueSignups.status,
        venueType: venueSignups.venueType,
      })
      .from(venueSignups)
      .orderBy(desc(venueSignups.createdAt)),
  ])

  // Emailable recipients are de-duplicated by email; non-emailable rows are
  // always kept individually (they have no/invalid email to dedupe on).
  const byEmail = new Map<string, EmailableVenue>()
  const nonEmailable: EmailableVenue[] = []

  const add = (v: EmailableVenue) => {
    if (!v.emailable) {
      nonEmailable.push(v)
      return
    }
    const email = v.email.trim().toLowerCase()
    const existing = byEmail.get(email)
    if (!existing) {
      byEmail.set(email, v)
      return
    }
    // Keep whichever has a real contact name; otherwise keep the higher priority.
    if (!existing.contactName && v.contactName) byEmail.set(email, v)
  }

  for (const r of dir) {
    const email = (r.email ?? "").trim()
    const t = resolveTailoring(r.id)
    add({
      key: `directory:${r.id}`,
      source: "directory",
      id: r.id,
      venueName: r.name,
      contactName: r.owner ?? "",
      email,
      status: r.status,
      category: r.category,
      priority: r.priority ?? Number.MAX_SAFE_INTEGER,
      tier: r.tier,
      confidence: r.confidence,
      emailable: r.emailable && EMAIL_RE.test(email),
      timesSent: r.timesSent ?? 0,
      lastSentAt: r.lastSentAt ? r.lastSentAt.toISOString() : null,
      tailoring: t.isTailored
        ? { hook: t.hook, heroImage: t.heroImage, heroAlt: t.heroAlt, subject: t.subject }
        : null,
    })
  }
  for (const r of signs) {
    const email = (r.email ?? "").trim()
    add({
      key: `signup:${r.id}`,
      source: "signup",
      id: r.id,
      venueName: r.venueName,
      contactName: r.contactName,
      email,
      status: r.status,
      category: r.venueType ?? null,
      // Signups are our warmest leads — float them above the directory.
      priority: -1,
      tier: null,
      confidence: null,
      emailable: EMAIL_RE.test(email),
      timesSent: 0,
      lastSentAt: null,
      tailoring: null,
    })
  }

  return [...byEmail.values(), ...nonEmailable].sort(
    (a, b) => a.priority - b.priority || a.venueName.localeCompare(b.venueName),
  )
}

/** Re-fetch fresh recipient rows from the DB for a set of keys (never trust client data). */
async function resolveRecipients(keys: string[]) {
  const all = await getEmailableVenues()
  const want = new Set(keys)
  // Never send to a non-emailable row even if its key is passed in.
  return all.filter((v) => want.has(v.key) && v.emailable)
}

/**
 * Renders a personalised preview for one sample recipient. Used by the composer
 * to show exactly what a venue will receive (subject + body) before sending.
 */
export async function renderVenuePreview(input: {
  subject: string
  content: VenueEmailContent
  sample: { venueName: string; contactName: string }
  venue?: { source: "directory" | "signup"; id: number }
  override?: VenueOverride
}) {
  await assertAdmin()
  return renderForVenue({
    masterSubject: input.subject,
    masterContent: input.content,
    vars: {
      venueName: input.sample.venueName || "The Northern Tap",
      contactName: input.sample.contactName || "Alex",
    },
    source: input.venue?.source ?? "signup",
    id: input.venue?.id ?? -1,
    override: input.override,
    // Keep hero paths relative so the in-app preview loads them locally.
    absolute: false,
  })
}

/**
 * Sends a single test email to the admin's chosen address using sample
 * personalisation, so they can sanity-check rendering before a real blast.
 */
export async function sendVenueTest(input: {
  testEmail: string
  subject: string
  content: VenueEmailContent
  sample?: { venueName: string; contactName: string }
  venue?: { source: "directory" | "signup"; id: number }
  override?: VenueOverride
}) {
  await assertAdmin()
  const to = input.testEmail.trim()
  if (!EMAIL_RE.test(to)) return { ok: false as const, error: "Enter a valid test email." }

  const rendered = renderForVenue({
    masterSubject: input.subject,
    masterContent: input.content,
    vars: {
      venueName: input.sample?.venueName || "The Northern Tap",
      contactName: input.sample?.contactName || "Alex",
    },
    source: input.venue?.source ?? "signup",
    id: input.venue?.id ?? -1,
    override: input.override,
  })
  const res = await sendEmail({
    to,
    subject: `[TEST] ${rendered.subject}`,
    html: rendered.html,
    recipientType: "admin",
    template: "venue-campaign-test",
  })

  if (!res.ok) {
    return {
      ok: false as const,
      error: res.skipped ? "Email isn't configured yet (set RESEND_API_KEY)." : res.error ?? "Send failed.",
    }
  }
  return { ok: true as const }
}

/**
 * Sends the campaign to the selected venues, personalising the subject and body
 * per recipient. Directory prospects we contact are advanced to 'pending'.
 */
export async function sendVenueCampaign(input: {
  recipientKeys: string[]
  subject: string
  content: VenueEmailContent
  // Per-venue overrides keyed by EmailableVenue.key (e.g. "directory:49").
  overrides?: Record<string, VenueOverride>
}) {
  await assertAdmin()

  if (!input.subject.trim()) return { ok: false as const, error: "Add a subject line." }
  const recipients = await resolveRecipients(input.recipientKeys)
  if (!recipients.length) return { ok: false as const, error: "No valid recipients selected." }

  // Directory rows that were successfully emailed — bump their send tracking.
  const sentDirectoryIds: number[] = []
  // Of those, the ones still 'prospect' get advanced to 'pending'.
  const prospectIds = new Set<number>()

  let sent = 0
  let failed = 0
  let skipped = 0
  const errors: string[] = []

  for (const r of recipients) {
    const rendered = renderForVenue({
      masterSubject: input.subject,
      masterContent: input.content,
      vars: { venueName: r.venueName, contactName: r.contactName },
      source: r.source,
      id: r.id,
      override: input.overrides?.[r.key],
    })
    const res = await sendEmail({
      to: r.email,
      subject: rendered.subject,
      html: rendered.html,
      recipientType: "venue",
      recipientId: r.id,
      template: "venue-campaign",
    })

    if (res.ok) {
      sent++
      if (r.source === "directory") {
        sentDirectoryIds.push(r.id)
        if (r.status === "prospect") prospectIds.add(r.id)
      }
    } else if ("skipped" in res && res.skipped) {
      skipped++
    } else {
      failed++
      if (res.error && errors.length < 5) errors.push(`${r.venueName}: ${res.error}`)
    }
  }

  // Persist send tracking (timesSent + lastSentAt) and advance fresh prospects.
  if (sentDirectoryIds.length) {
    const now = new Date()
    await Promise.all(
      sentDirectoryIds.map((id) =>
        db
          .update(venueDirectory)
          .set({
            timesSent: sql`${venueDirectory.timesSent} + 1`,
            lastSentAt: now,
            status: prospectIds.has(id) ? "pending" : undefined,
            updatedAt: now,
          })
          .where(eq(venueDirectory.id, id)),
      ),
    )
  }

  return {
    ok: sent > 0,
    total: recipients.length,
    sent,
    failed,
    skipped,
    errors,
  }
}

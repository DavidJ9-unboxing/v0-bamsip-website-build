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

async function assertAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
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
  confidence: string | null
  // false = no valid email; Send/Resend is disabled and it's excluded from bulk.
  emailable: boolean
  // Outreach tracking, persisted on the directory row.
  timesSent: number
  lastSentAt: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      confidence: r.confidence,
      emailable: r.emailable && EMAIL_RE.test(email),
      timesSent: r.timesSent ?? 0,
      lastSentAt: r.lastSentAt ? r.lastSentAt.toISOString() : null,
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
      confidence: null,
      emailable: EMAIL_RE.test(email),
      timesSent: 0,
      lastSentAt: null,
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
}) {
  await assertAdmin()
  const vars = {
    venueName: input.sample.venueName || "The Northern Tap",
    contactName: input.sample.contactName || "Alex",
  }
  return {
    subject: applyVenueTokens(input.subject, vars),
    html: applyVenueTokens(buildVenueEmailHtml(input.content), vars),
  }
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
}) {
  await assertAdmin()
  const to = input.testEmail.trim()
  if (!EMAIL_RE.test(to)) return { ok: false as const, error: "Enter a valid test email." }

  const vars = {
    venueName: input.sample?.venueName || "The Northern Tap",
    contactName: input.sample?.contactName || "Alex",
  }
  const res = await sendEmail({
    to,
    subject: `[TEST] ${applyVenueTokens(input.subject, vars)}`,
    html: applyVenueTokens(buildVenueEmailHtml(input.content), vars),
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
}) {
  await assertAdmin()

  if (!input.subject.trim()) return { ok: false as const, error: "Add a subject line." }
  const recipients = await resolveRecipients(input.recipientKeys)
  if (!recipients.length) return { ok: false as const, error: "No valid recipients selected." }

  const baseHtml = buildVenueEmailHtml(input.content)
  // Directory rows that were successfully emailed — bump their send tracking.
  const sentDirectoryIds: number[] = []
  // Of those, the ones still 'prospect' get advanced to 'pending'.
  const prospectIds = new Set<number>()

  let sent = 0
  let failed = 0
  let skipped = 0
  const errors: string[] = []

  for (const r of recipients) {
    const vars = { venueName: r.venueName, contactName: r.contactName }
    const res = await sendEmail({
      to: r.email,
      subject: applyVenueTokens(input.subject, vars),
      html: applyVenueTokens(baseHtml, vars),
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

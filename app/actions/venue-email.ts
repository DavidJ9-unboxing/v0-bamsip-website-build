"use server"

import { db } from "@/lib/db"
import { venueDirectory, venueSignups } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
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
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Returns every venue we can email — researched directory prospects plus
 * venues that submitted the signup form. Rows without a valid email are
 * dropped, and duplicates (same email) are collapsed to a single recipient
 * (preferring the record with the richer contact name) so nobody is double-sent.
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
      })
      .from(venueDirectory)
      .orderBy(desc(venueDirectory.updatedAt)),
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

  const byEmail = new Map<string, EmailableVenue>()

  const add = (v: EmailableVenue) => {
    const email = v.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) return
    const existing = byEmail.get(email)
    if (!existing) {
      byEmail.set(email, v)
      return
    }
    // Keep whichever has a real contact name; otherwise keep the first seen.
    if (!existing.contactName && v.contactName) byEmail.set(email, v)
  }

  for (const r of dir) {
    add({
      key: `directory:${r.id}`,
      source: "directory",
      id: r.id,
      venueName: r.name,
      contactName: r.owner ?? "",
      email: r.email ?? "",
      status: r.status,
      category: r.category,
    })
  }
  for (const r of signs) {
    add({
      key: `signup:${r.id}`,
      source: "signup",
      id: r.id,
      venueName: r.venueName,
      contactName: r.contactName,
      email: r.email,
      status: r.status,
      category: r.venueType ?? null,
    })
  }

  return [...byEmail.values()].sort((a, b) =>
    a.venueName.localeCompare(b.venueName),
  )
}

/** Re-fetch fresh recipient rows from the DB for a set of keys (never trust client data). */
async function resolveRecipients(keys: string[]) {
  const all = await getEmailableVenues()
  const want = new Set(keys)
  return all.filter((v) => want.has(v.key))
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
}) {
  await assertAdmin()
  const to = input.testEmail.trim()
  if (!EMAIL_RE.test(to)) return { ok: false as const, error: "Enter a valid test email." }

  const vars = { venueName: "The Northern Tap", contactName: "Alex" }
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
  const directoryProspectIds: number[] = []

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
      if (r.source === "directory" && r.status === "prospect") {
        directoryProspectIds.push(r.id)
      }
    } else if ("skipped" in res && res.skipped) {
      skipped++
    } else {
      failed++
      if (res.error && errors.length < 5) errors.push(`${r.venueName}: ${res.error}`)
    }
  }

  // Advance freshly-contacted directory prospects to 'pending'.
  if (directoryProspectIds.length) {
    await Promise.all(
      directoryProspectIds.map((id) =>
        db
          .update(venueDirectory)
          .set({ status: "pending", updatedAt: new Date() })
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

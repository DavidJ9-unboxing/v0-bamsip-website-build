"use server"

import { db } from "@/lib/db"
import { venueDirectory, venueSignups } from "@/lib/db/schema"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { getAdminSession } from "@/lib/admin"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/messaging"
import { venueLaunchEmail, venueLaunchSubject } from "@/lib/email-templates"
import { getBaseUrl } from "@/lib/referral"

async function assertAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
}

/* ------------------------------ Matching ------------------------------ */

/** Normalises a venue name for fuzzy comparison. */
function normaliseName(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(the|bar|club|pub|lounge|manchester|mcr|ltd|limited)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim()
}

/** Pulls a comparable host/handle token out of a website or social URL. */
function socialToken(value?: string | null) {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (!v) return null
  // strip protocol + www, take the host or @handle
  const handle = v.replace(/^@/, "")
  const host = v
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0]
  return (host || handle).replace(/[^a-z0-9.]/g, "") || null
}

/**
 * Finds the directory row that best matches an incoming signup.
 * Strategy: normalised name match, optionally corroborated by a shared
 * website/instagram/facebook token to raise confidence.
 */
export async function findDirectoryMatch(input: {
  venueName: string
  website?: string | null
  instagram?: string | null
  facebook?: string | null
}) {
  const target = normaliseName(input.venueName)
  if (!target) return null

  const candidates = await db.select().from(venueDirectory)

  const incomingTokens = new Set(
    [input.website, input.instagram, input.facebook]
      .map(socialToken)
      .filter(Boolean) as string[],
  )

  let best: { row: (typeof candidates)[number]; score: number } | null = null
  for (const row of candidates) {
    const candName = normaliseName(row.name)
    if (!candName) continue

    let score = 0
    if (candName === target) score += 3
    else if (candName.includes(target) || target.includes(candName)) score += 2
    else continue // name must at least loosely match

    const candTokens = [row.website, row.instagram, row.facebook]
      .map(socialToken)
      .filter(Boolean) as string[]
    if (candTokens.some((t) => incomingTokens.has(t))) score += 2

    if (!best || score > best.score) best = { row, score }
  }

  return best?.row ?? null
}

/**
 * Called when a venue signs up. Merges the submitted contact details into a
 * matching directory row (if any) and marks it 'pending'. Never overwrites
 * existing non-empty research fields — only fills gaps and records the email.
 */
export async function linkSignupToDirectory(signupId: number, input: {
  venueName: string
  email: string
  phone?: string | null
}) {
  const match = await findDirectoryMatch({ venueName: input.venueName })
  if (!match) return { matched: false as const }

  await db
    .update(venueDirectory)
    .set({
      // only set the status forward, never demote a signed_up record
      status: match.status === "signed_up" ? "signed_up" : "pending",
      signupId,
      email: match.email ?? input.email,
      phone: match.phone ?? input.phone ?? null,
      updatedAt: new Date(),
    })
    .where(eq(venueDirectory.id, match.id))

  revalidatePath("/admin/venues/directory")
  return { matched: true as const, directoryId: match.id }
}

/**
 * Marks the directory row linked to a signup as fully signed up. Called when
 * a venue signup is confirmed.
 */
export async function markDirectorySignedUp(signupId: number) {
  await db
    .update(venueDirectory)
    .set({ status: "signed_up", updatedAt: new Date() })
    .where(eq(venueDirectory.signupId, signupId))
  revalidatePath("/admin/venues/directory")
}

/* ------------------------------ Admin CRUD ----------------------------- */

export async function listDirectory(opts?: {
  search?: string
  status?: string
  category?: string
}) {
  await assertAdmin()
  const conds = []
  if (opts?.search) {
    conds.push(
      or(
        ilike(venueDirectory.name, `%${opts.search}%`),
        ilike(venueDirectory.address, `%${opts.search}%`),
        ilike(venueDirectory.owner, `%${opts.search}%`),
      ),
    )
  }
  if (opts?.status && opts.status !== "all")
    conds.push(eq(venueDirectory.status, opts.status))
  if (opts?.category && opts.category !== "all")
    conds.push(eq(venueDirectory.category, opts.category))

  return db
    .select()
    .from(venueDirectory)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(venueDirectory.confidence), venueDirectory.name)
    .limit(1000)
}

export async function getDirectoryStats() {
  await assertAdmin()
  const [counts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      prospect: sql<number>`count(*) filter (where ${venueDirectory.status} = 'prospect')::int`,
      pending: sql<number>`count(*) filter (where ${venueDirectory.status} = 'pending')::int`,
      signedUp: sql<number>`count(*) filter (where ${venueDirectory.status} = 'signed_up')::int`,
      withMobile: sql<number>`count(*) filter (where ${venueDirectory.mobile} is not null)::int`,
    })
    .from(venueDirectory)
  return counts
}

export async function getDirectoryCategories() {
  await assertAdmin()
  const rows = await db
    .select({ category: venueDirectory.category })
    .from(venueDirectory)
    .where(sql`${venueDirectory.category} is not null`)
    .groupBy(venueDirectory.category)
    .orderBy(venueDirectory.category)
  return rows.map((r) => r.category).filter(Boolean) as string[]
}

export async function updateDirectoryVenue(
  id: number,
  input: Partial<{
    name: string
    category: string
    address: string
    website: string
    instagram: string
    facebook: string
    owner: string
    role: string
    email: string
    phone: string
    phoneSecondary: string
    mobile: string
    mobileSecondary: string
    smsOptIn: boolean
    status: string
    notes: string
  }>,
) {
  await assertAdmin()
  const clean = (v?: string) => {
    if (v === undefined) return undefined
    const s = v.trim()
    return s === "" ? null : s
  }
  await db
    .update(venueDirectory)
    .set({
      name: input.name?.trim() || undefined,
      category: clean(input.category),
      address: clean(input.address),
      website: clean(input.website),
      instagram: clean(input.instagram),
      facebook: clean(input.facebook),
      owner: clean(input.owner),
      role: clean(input.role),
      email: clean(input.email),
      phone: clean(input.phone),
      phoneSecondary: clean(input.phoneSecondary),
      mobile: clean(input.mobile),
      mobileSecondary: clean(input.mobileSecondary),
      smsOptIn: input.smsOptIn,
      status: input.status,
      notes: clean(input.notes),
      updatedAt: new Date(),
    })
    .where(eq(venueDirectory.id, id))
  revalidatePath("/admin/venues/directory")
}

/**
 * Sends the venue launch/outreach email to a directory record. The subject is
 * generated dynamically from the venue's name (never baked into the template).
 * On success the record is moved to 'pending' so the directory reflects that
 * we've made contact.
 */
export async function sendVenueLaunchEmail(id: number) {
  await assertAdmin()

  const [venue] = await db
    .select({
      id: venueDirectory.id,
      name: venueDirectory.name,
      owner: venueDirectory.owner,
      email: venueDirectory.email,
      status: venueDirectory.status,
    })
    .from(venueDirectory)
    .where(eq(venueDirectory.id, id))
    .limit(1)

  if (!venue) return { ok: false as const, error: "Venue not found." }
  if (!venue.email)
    return { ok: false as const, error: "Add an email address before sending." }

  const ctaUrl = `${getBaseUrl()}/venues`
  const res = await sendEmail({
    to: venue.email,
    subject: venueLaunchSubject(venue.name),
    recipientType: "venue",
    template: "venue-launch",
    html: venueLaunchEmail(venue.owner ?? "", venue.name, ctaUrl),
    text: `Hi${venue.owner ? ` ${venue.owner}` : ""}, we're bringing BamSip to Manchester this July and would love to feature ${venue.name}. See the venue details: ${ctaUrl}`,
  })

  if (!res.ok) {
    return {
      ok: false as const,
      error: res.skipped ? "Email isn't configured yet." : res.error ?? "Send failed.",
    }
  }

  // Only advance a fresh prospect; never demote a signed_up record.
  if (venue.status === "prospect") {
    await db
      .update(venueDirectory)
      .set({ status: "pending", updatedAt: new Date() })
      .where(eq(venueDirectory.id, id))
  }

  revalidatePath("/admin/venues/directory")
  return { ok: true as const }
}

export async function deleteDirectoryVenue(id: number) {
  await assertAdmin()
  await db.delete(venueDirectory).where(eq(venueDirectory.id, id))
  revalidatePath("/admin/venues/directory")
}

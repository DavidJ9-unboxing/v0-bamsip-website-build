"use server"

import { db } from "@/lib/db"
import {
  bammerSignups,
  venueSignups,
  payouts,
  messageLog,
} from "@/lib/db/schema"
import { and, desc, eq, ilike, or, sql, inArray } from "drizzle-orm"
import { getAdminSession } from "@/lib/admin"
import { generateReferralCode, PAYOUT_APPROVER_EMAIL } from "@/lib/referral"
import {
  sendEmail,
  sendSms,
  emailConfigured,
  smsConfigured,
} from "@/lib/messaging"
import { sendPayout, paypalConfigured } from "@/lib/paypal"
import { revalidatePath } from "next/cache"

async function assertAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
}

export async function getServiceStatus() {
  await assertAdmin()
  return {
    email: emailConfigured(),
    sms: smsConfigured(),
    paypal: paypalConfigured(),
  }
}

/* ------------------------------- Dashboard ------------------------------- */

export async function getDashboardStats() {
  await assertAdmin()

  const [bammerCounts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      confirmed: sql<number>`count(*) filter (where ${bammerSignups.status} = 'confirmed')::int`,
      pending: sql<number>`count(*) filter (where ${bammerSignups.status} = 'pending')::int`,
      smsOptIn: sql<number>`count(*) filter (where ${bammerSignups.smsOptIn} = true)::int`,
    })
    .from(bammerSignups)

  const [venueCounts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      confirmed: sql<number>`count(*) filter (where ${venueSignups.status} = 'confirmed')::int`,
    })
    .from(venueSignups)

  const [payoutCounts] = await db
    .select({
      owed: sql<number>`count(*) filter (where ${payouts.status} = 'owed')::int`,
      owedAmount: sql<number>`coalesce(sum(${payouts.amountGbp}) filter (where ${payouts.status} = 'owed'), 0)::int`,
      paid: sql<number>`count(*) filter (where ${payouts.status} = 'paid')::int`,
      paidAmount: sql<number>`coalesce(sum(${payouts.amountGbp}) filter (where ${payouts.status} = 'paid'), 0)::int`,
    })
    .from(payouts)

  return {
    bammers: bammerCounts,
    venues: venueCounts,
    payouts: payoutCounts,
  }
}

export async function getSignupTrend() {
  await assertAdmin()
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${bammerSignups.createdAt}), 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(bammerSignups)
    .groupBy(sql`date_trunc('day', ${bammerSignups.createdAt})`)
    .orderBy(sql`date_trunc('day', ${bammerSignups.createdAt})`)
  return rows
}

export async function getTasteBreakdown() {
  await assertAdmin()

  const vibes = await db
    .select({
      label: sql<string>`coalesce(${bammerSignups.vibe}, 'unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(bammerSignups)
    .groupBy(bammerSignups.vibe)
    .orderBy(desc(sql`count(*)`))

  const motivations = await db
    .select({
      label: sql<string>`coalesce(${bammerSignups.motivation}, 'unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(bammerSignups)
    .groupBy(bammerSignups.motivation)
    .orderBy(desc(sql`count(*)`))

  const venueGoals = await db
    .select({
      label: sql<string>`coalesce(${venueSignups.goal}, 'unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(venueSignups)
    .groupBy(venueSignups.goal)
    .orderBy(desc(sql`count(*)`))

  return { vibes, motivations, venueGoals }
}

/* --------------------------------- Bammers -------------------------------- */

export async function listBammers(search?: string) {
  await assertAdmin()
  const where = search
    ? or(
        ilike(bammerSignups.name, `%${search}%`),
        ilike(bammerSignups.email, `%${search}%`),
        ilike(bammerSignups.phone, `%${search}%`),
      )
    : undefined

  const rows = await db
    .select()
    .from(bammerSignups)
    .where(where)
    .orderBy(desc(bammerSignups.createdAt))
    .limit(500)

  // referral counts: confirmed signups grouped by referredBy
  const refCounts = await db
    .select({
      code: bammerSignups.referredBy,
      count: sql<number>`count(*)::int`,
    })
    .from(bammerSignups)
    .where(
      and(
        eq(bammerSignups.status, "confirmed"),
        sql`${bammerSignups.referredBy} is not null`,
      ),
    )
    .groupBy(bammerSignups.referredBy)

  const refMap = new Map(refCounts.map((r) => [r.code, r.count]))
  return rows.map((r) => ({
    ...r,
    referralCount: refMap.get(r.referralCode) ?? 0,
  }))
}

export async function addBammerManually(input: {
  name: string
  email: string
  phone?: string
  smsOptIn?: boolean
  vibe?: string
  notes?: string
}) {
  await assertAdmin()
  const email = input.email.trim().toLowerCase()
  const existing = await db
    .select({ id: bammerSignups.id })
    .from(bammerSignups)
    .where(sql`lower(${bammerSignups.email}) = ${email}`)
    .limit(1)
  if (existing.length) throw new Error("That email is already on the list")

  await db.insert(bammerSignups).values({
    name: input.name.trim(),
    email,
    phone: input.phone?.trim() || null,
    smsOptIn: input.smsOptIn ?? false,
    vibe: input.vibe || null,
    referralCode: generateReferralCode(),
    status: "confirmed",
    confirmedAt: new Date(),
    source: "admin",
    notes: input.notes?.trim() || null,
  })
  revalidatePath("/admin/bammers")
  revalidatePath("/admin")
}

export async function updateBammerStatus(id: number, status: string) {
  await assertAdmin()
  await db
    .update(bammerSignups)
    .set({
      status,
      confirmedAt: status === "confirmed" ? new Date() : null,
    })
    .where(eq(bammerSignups.id, id))
  revalidatePath("/admin/bammers")
}

export async function updateBammerNotes(id: number, notes: string) {
  await assertAdmin()
  await db
    .update(bammerSignups)
    .set({ notes })
    .where(eq(bammerSignups.id, id))
  revalidatePath("/admin/bammers")
}

export async function deleteBammer(id: number) {
  await assertAdmin()
  await db.delete(bammerSignups).where(eq(bammerSignups.id, id))
  revalidatePath("/admin/bammers")
}

/* --------------------------------- Venues --------------------------------- */

export async function listVenues(search?: string) {
  await assertAdmin()
  const where = search
    ? or(
        ilike(venueSignups.venueName, `%${search}%`),
        ilike(venueSignups.contactName, `%${search}%`),
        ilike(venueSignups.email, `%${search}%`),
      )
    : undefined
  return db
    .select()
    .from(venueSignups)
    .where(where)
    .orderBy(desc(venueSignups.createdAt))
    .limit(500)
}

export async function addVenueManually(input: {
  venueName: string
  contactName: string
  email: string
  phone?: string
  role?: string
  venueType?: string
  notes?: string
}) {
  await assertAdmin()
  const email = input.email.trim().toLowerCase()
  await db.insert(venueSignups).values({
    venueName: input.venueName.trim(),
    contactName: input.contactName.trim(),
    email,
    phone: input.phone?.trim() || null,
    role: input.role || null,
    venueType: input.venueType || null,
    status: "confirmed",
    confirmedAt: new Date(),
    source: "admin",
    notes: input.notes?.trim() || null,
  })
  revalidatePath("/admin/venues")
  revalidatePath("/admin")
}

export async function updateVenueStatus(id: number, status: string) {
  await assertAdmin()
  await db
    .update(venueSignups)
    .set({
      status,
      confirmedAt: status === "confirmed" ? new Date() : null,
    })
    .where(eq(venueSignups.id, id))
  revalidatePath("/admin/venues")
}

export async function updateVenueNotes(id: number, notes: string) {
  await assertAdmin()
  await db.update(venueSignups).set({ notes }).where(eq(venueSignups.id, id))
  revalidatePath("/admin/venues")
}

export async function deleteVenue(id: number) {
  await assertAdmin()
  await db.delete(venueSignups).where(eq(venueSignups.id, id))
  revalidatePath("/admin/venues")
}

/* -------------------------------- Messaging ------------------------------- */

export async function sendBroadcast(input: {
  audience: "bammers" | "venues"
  segment: "all" | "confirmed" | "sms-opt-in"
  channel: "email" | "sms"
  subject?: string
  body: string
}) {
  await assertAdmin()

  let recipients: {
    id: number
    email: string
    phone: string | null
    smsOptIn: boolean
    name: string
  }[] = []

  if (input.audience === "bammers") {
    const conds = []
    if (input.segment === "confirmed")
      conds.push(eq(bammerSignups.status, "confirmed"))
    if (input.segment === "sms-opt-in")
      conds.push(eq(bammerSignups.smsOptIn, true))
    recipients = await db
      .select({
        id: bammerSignups.id,
        email: bammerSignups.email,
        phone: bammerSignups.phone,
        smsOptIn: bammerSignups.smsOptIn,
        name: bammerSignups.name,
      })
      .from(bammerSignups)
      .where(conds.length ? and(...conds) : undefined)
  } else {
    const conds = []
    if (input.segment === "confirmed")
      conds.push(eq(venueSignups.status, "confirmed"))
    if (input.segment === "sms-opt-in")
      conds.push(eq(venueSignups.smsOptIn, true))
    recipients = await db
      .select({
        id: venueSignups.id,
        email: venueSignups.email,
        phone: venueSignups.phone,
        smsOptIn: venueSignups.smsOptIn,
        name: venueSignups.contactName,
      })
      .from(venueSignups)
      .where(conds.length ? and(...conds) : undefined)
  }

  let sent = 0
  let skipped = 0
  for (const r of recipients) {
    if (input.channel === "email") {
      const res = await sendEmail({
        to: r.email,
        subject: input.subject || "An update from BamSip",
        html: `<p>${input.body.replace(/\n/g, "<br/>")}</p>`,
        text: input.body,
        recipientType: input.audience === "bammers" ? "bammer" : "venue",
        recipientId: r.id,
        template: "broadcast",
      })
      res.ok ? sent++ : skipped++
    } else {
      // SMS only to opted-in recipients with a phone
      if (!r.smsOptIn || !r.phone) {
        skipped++
        continue
      }
      const res = await sendSms({
        to: r.phone,
        body: input.body,
        recipientType: input.audience === "bammers" ? "bammer" : "venue",
        recipientId: r.id,
        template: "broadcast",
      })
      res.ok ? sent++ : skipped++
    }
  }

  revalidatePath("/admin/messages")
  return { total: recipients.length, sent, skipped }
}

export async function getMessageLog() {
  await assertAdmin()
  return db
    .select()
    .from(messageLog)
    .orderBy(desc(messageLog.createdAt))
    .limit(200)
}

/* --------------------------------- Payouts -------------------------------- */

export async function listPayouts() {
  await assertAdmin()
  const rows = await db
    .select({
      id: payouts.id,
      bammerId: payouts.bammerId,
      paypalEmail: payouts.paypalEmail,
      amountGbp: payouts.amountGbp,
      referralsSnapshot: payouts.referralsSnapshot,
      status: payouts.status,
      error: payouts.error,
      createdAt: payouts.createdAt,
      paidAt: payouts.paidAt,
      bammerName: bammerSignups.name,
      bammerEmail: bammerSignups.email,
    })
    .from(payouts)
    .leftJoin(bammerSignups, eq(payouts.bammerId, bammerSignups.id))
    .orderBy(desc(payouts.createdAt))
  return rows
}

/**
 * Approve an over-cap payout. Only the designated approver
 * (PAYOUT_APPROVER_EMAIL) may do this; flips "needs_approval" → "owed".
 */
export async function approvePayout(payoutId: number) {
  const admin = await assertAdmin()
  if (admin.email.toLowerCase() !== PAYOUT_APPROVER_EMAIL.toLowerCase()) {
    return {
      ok: false as const,
      error: `Only ${PAYOUT_APPROVER_EMAIL} can approve over-cap payouts.`,
    }
  }
  const [p] = await db
    .select()
    .from(payouts)
    .where(eq(payouts.id, payoutId))
    .limit(1)
  if (!p) throw new Error("Payout not found")
  if (p.status !== "needs_approval") {
    return { ok: false as const, error: "This payout isn't awaiting approval." }
  }
  await db
    .update(payouts)
    .set({ status: "owed", error: null })
    .where(eq(payouts.id, payoutId))
  revalidatePath("/admin/payouts")
  return { ok: true as const }
}

export async function sendPayoutNow(payoutId: number) {
  await assertAdmin()
  const [p] = await db
    .select()
    .from(payouts)
    .where(eq(payouts.id, payoutId))
    .limit(1)
  if (!p) throw new Error("Payout not found")
  if (p.status === "paid") return { ok: true, alreadyPaid: true }
  if (p.status === "needs_approval") {
    return {
      ok: false as const,
      error: `Needs approval from ${PAYOUT_APPROVER_EMAIL} before it can be sent.`,
    }
  }

  const result = await sendPayout({
    senderItemId: String(p.id),
    email: p.paypalEmail,
    amountGbp: p.amountGbp,
    note: "BamSip referral reward — thanks for spreading the word!",
  })

  // If PayPal isn't configured yet, leave the payout as "owed" so it can be
  // sent later once credentials are added — don't mark it failed.
  if ("skipped" in result && result.skipped) {
    await db
      .update(payouts)
      .set({ error: "PayPal not configured — add PayPal API keys to send." })
      .where(eq(payouts.id, payoutId))
    revalidatePath("/admin/payouts")
    return { ok: false as const, skipped: true as const }
  }

  await db
    .update(payouts)
    .set({
      status: result.ok ? "paid" : "failed",
      paypalBatchId: result.ok ? result.batchId ?? null : null,
      error: result.ok ? null : result.error ?? "Unknown error",
      paidAt: result.ok ? new Date() : null,
    })
    .where(eq(payouts.id, payoutId))

  revalidatePath("/admin/payouts")
  return result
}

export async function markPayoutPaid(payoutId: number) {
  await assertAdmin()
  await db
    .update(payouts)
    .set({ status: "paid", paidAt: new Date(), error: null })
    .where(eq(payouts.id, payoutId))
  revalidatePath("/admin/payouts")
}

export async function setPayoutPaypalEmail(payoutId: number, email: string) {
  await assertAdmin()
  await db
    .update(payouts)
    .set({ paypalEmail: email.trim() })
    .where(eq(payouts.id, payoutId))
  revalidatePath("/admin/payouts")
}

/* ---------------------------------- Export -------------------------------- */

export async function exportCsv(kind: "bammers" | "venues" | "payouts") {
  await assertAdmin()

  function toCsv(headers: string[], rows: (string | number | null)[][]) {
    const esc = (v: string | number | null) => {
      const s = v == null ? "" : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    return [headers.join(","), ...rows.map((r) => r.map(esc).join(","))].join(
      "\n",
    )
  }

  if (kind === "bammers") {
    const rows = await db
      .select()
      .from(bammerSignups)
      .orderBy(desc(bammerSignups.createdAt))
    return toCsv(
      [
        "id",
        "name",
        "email",
        "phone",
        "sms_opt_in",
        "vibe",
        "frequency",
        "motivation",
        "referral_code",
        "referred_by",
        "status",
        "source",
        "created_at",
      ],
      rows.map((r) => [
        r.id,
        r.name,
        r.email,
        r.phone,
        r.smsOptIn ? "yes" : "no",
        r.vibe,
        r.frequency,
        r.motivation,
        r.referralCode,
        r.referredBy,
        r.status,
        r.source,
        r.createdAt?.toISOString() ?? "",
      ]),
    )
  }

  if (kind === "venues") {
    const rows = await db
      .select()
      .from(venueSignups)
      .orderBy(desc(venueSignups.createdAt))
    return toCsv(
      [
        "id",
        "venue_name",
        "contact_name",
        "email",
        "phone",
        "role",
        "venue_type",
        "goal",
        "challenge",
        "status",
        "source",
        "created_at",
      ],
      rows.map((r) => [
        r.id,
        r.venueName,
        r.contactName,
        r.email,
        r.phone,
        r.role,
        r.venueType,
        r.goal,
        r.challenge,
        r.status,
        r.source,
        r.createdAt?.toISOString() ?? "",
      ]),
    )
  }

  const rows = await listPayouts()
  return toCsv(
    [
      "id",
      "bammer_name",
      "bammer_email",
      "paypal_email",
      "amount_gbp",
      "referrals",
      "status",
      "created_at",
      "paid_at",
    ],
    rows.map((r) => [
      r.id,
      r.bammerName,
      r.bammerEmail,
      r.paypalEmail,
      r.amountGbp,
      r.referralsSnapshot,
      r.status,
      r.createdAt?.toISOString() ?? "",
      r.paidAt?.toISOString() ?? "",
    ]),
  )
}

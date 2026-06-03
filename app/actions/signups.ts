"use server"

import { db } from "@/lib/db"
import { bammerSignups, venueSignups, payouts } from "@/lib/db/schema"
import { and, eq, sql } from "drizzle-orm"
import {
  generateReferralCode,
  generateToken,
  getBaseUrl,
  REFERRAL_THRESHOLD,
  PAYOUT_AMOUNT_GBP,
} from "@/lib/referral"
import { sendEmail, sendSms } from "@/lib/messaging"
import {
  bammerConfirmEmail,
  bammerWelcomeEmail,
  venueConfirmEmail,
} from "@/lib/email-templates"

type Result = { ok: boolean; error?: string; referralCode?: string }

/* ------------------------------- Bammer ------------------------------- */

export async function registerBammer(input: {
  name: string
  email: string
  phone?: string
  smsOptIn?: boolean
  vibe?: string
  frequency?: string
  motivation?: string
  referredBy?: string
}): Promise<Result> {
  const email = input.email.trim().toLowerCase()
  const name = input.name.trim()
  if (!name || !email) return { ok: false, error: "Name and email are required." }

  try {
  // Already registered?
  const existing = await db
    .select({ id: bammerSignups.id, referralCode: bammerSignups.referralCode })
    .from(bammerSignups)
    .where(eq(sql`lower(${bammerSignups.email})`, email))
    .limit(1)
  if (existing.length) {
    return {
      ok: true,
      referralCode: existing[0].referralCode,
      error: "already-registered",
    }
  }

  // Unique referral code
  let referralCode = generateReferralCode()
  for (let i = 0; i < 5; i++) {
    const clash = await db
      .select({ id: bammerSignups.id })
      .from(bammerSignups)
      .where(eq(bammerSignups.referralCode, referralCode))
      .limit(1)
    if (!clash.length) break
    referralCode = generateReferralCode()
  }

  // Validate referrer code if provided
  let referredBy: string | null = null
  if (input.referredBy) {
    const ref = await db
      .select({ code: bammerSignups.referralCode })
      .from(bammerSignups)
      .where(eq(bammerSignups.referralCode, input.referredBy.toUpperCase()))
      .limit(1)
    if (ref.length) referredBy = ref[0].code
  }

  const confirmToken = generateToken()

  const [row] = await db
    .insert(bammerSignups)
    .values({
      name,
      email,
      phone: input.phone?.trim() || null,
      smsOptIn: Boolean(input.smsOptIn),
      vibe: input.vibe || null,
      frequency: input.frequency || null,
      motivation: input.motivation?.trim() || null,
      referralCode,
      referredBy,
      confirmToken,
      status: "pending",
      source: "web",
    })
    .returning({ id: bammerSignups.id })

  // Double opt-in confirmation
  const confirmUrl = `${getBaseUrl()}/confirm?type=bammer&token=${confirmToken}`
  await sendEmail({
    to: email,
    subject: "Confirm your spot on the BamSip list",
    recipientType: "bammer",
    recipientId: row.id,
    template: "bammer-confirm",
    html: bammerConfirmEmail(name, confirmUrl, referralCode),
    text: `Hi ${name}, confirm your spot on the BamSip waitlist: ${confirmUrl}`,
  })

  if (input.smsOptIn && input.phone) {
    await sendSms({
      to: input.phone,
      recipientType: "bammer",
      recipientId: row.id,
      template: "bammer-confirm",
      body: `BamSip: confirm your spot and you're in — ${confirmUrl}. Reply STOP to opt out.`,
    })
  }

  return { ok: true, referralCode }
  } catch (err) {
    console.error("[v0] registerBammer THREW:", (err as Error)?.message, (err as Error)?.stack)
    return { ok: false, error: "something went wrong" }
  }
}

/* -------------------------------- Venue -------------------------------- */

export async function registerVenue(input: {
  venueName: string
  contactName: string
  email: string
  phone?: string
  role?: string
  smsOptIn?: boolean
  venueType?: string
  goal?: string
  challenge?: string
}): Promise<Result> {
  const email = input.email.trim().toLowerCase()
  if (!input.venueName.trim() || !input.contactName.trim() || !email)
    return { ok: false, error: "Venue name, contact and email are required." }

  const existing = await db
    .select({ id: venueSignups.id })
    .from(venueSignups)
    .where(eq(sql`lower(${venueSignups.email})`, email))
    .limit(1)
  if (existing.length) return { ok: true, error: "already-registered" }

  const confirmToken = generateToken()

  const [row] = await db
    .insert(venueSignups)
    .values({
      venueName: input.venueName.trim(),
      contactName: input.contactName.trim(),
      email,
      phone: input.phone?.trim() || null,
      role: input.role || null,
      smsOptIn: Boolean(input.smsOptIn),
      venueType: input.venueType || null,
      goal: input.goal || null,
      challenge: input.challenge?.trim() || null,
      confirmToken,
      status: "pending",
      source: "web",
    })
    .returning({ id: venueSignups.id })

  const confirmUrl = `${getBaseUrl()}/confirm?type=venue&token=${confirmToken}`
  await sendEmail({
    to: email,
    subject: "Thanks for your interest in BamSip for venues",
    recipientType: "venue",
    recipientId: row.id,
    template: "venue-confirm",
    html: venueConfirmEmail(input.contactName.trim(), input.venueName.trim(), confirmUrl),
    text: `Hi ${input.contactName}, confirm your venue interest: ${confirmUrl}`,
  })

  return { ok: true }
}

/* ----------------------------- Confirmation ---------------------------- */

export async function confirmSignup(
  type: "bammer" | "venue",
  token: string,
): Promise<{ ok: boolean; name?: string }> {
  if (!token) return { ok: false }

  if (type === "venue") {
    const [row] = await db
      .update(venueSignups)
      .set({ status: "confirmed", confirmedAt: new Date(), confirmToken: null })
      .where(eq(venueSignups.confirmToken, token))
      .returning({ name: venueSignups.contactName })
    return { ok: Boolean(row), name: row?.name }
  }

  const [row] = await db
    .update(bammerSignups)
    .set({ status: "confirmed", confirmedAt: new Date(), confirmToken: null })
    .where(eq(bammerSignups.confirmToken, token))
    .returning({
      id: bammerSignups.id,
      name: bammerSignups.name,
      email: bammerSignups.email,
      referralCode: bammerSignups.referralCode,
      referredBy: bammerSignups.referredBy,
    })

  if (row) {
    const shareUrl = `${getBaseUrl()}/bammers?ref=${row.referralCode}`
    await sendEmail({
      to: row.email,
      subject: "You're on the BamSip list 🙌",
      recipientType: "bammer",
      recipientId: row.id,
      template: "bammer-welcome",
      html: bammerWelcomeEmail(row.name, shareUrl, row.referralCode),
      text: `You're on the list! Share your link to earn £5 per 50 mates: ${shareUrl}`,
    })
    if (row.referredBy) await maybeCreatePayout(row.referredBy)
  }

  return { ok: Boolean(row), name: row?.name }
}

/**
 * Counts a referrer's confirmed referrals and, for every full block of
 * REFERRAL_THRESHOLD, ensures a payout row exists (repeatable).
 */
async function maybeCreatePayout(referrerCode: string) {
  const [referrer] = await db
    .select({
      id: bammerSignups.id,
      paypalEmail: bammerSignups.paypalEmail,
      email: bammerSignups.email,
    })
    .from(bammerSignups)
    .where(eq(bammerSignups.referralCode, referrerCode))
    .limit(1)
  if (!referrer) return

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bammerSignups)
    .where(
      and(
        eq(bammerSignups.referredBy, referrerCode),
        eq(bammerSignups.status, "confirmed"),
      ),
    )

  const earnedBlocks = Math.floor(Number(count) / REFERRAL_THRESHOLD)
  if (earnedBlocks < 1) return

  const [{ count: existingPayouts }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(payouts)
    .where(eq(payouts.bammerId, referrer.id))

  const toCreate = earnedBlocks - Number(existingPayouts)
  for (let i = 0; i < toCreate; i++) {
    await db.insert(payouts).values({
      bammerId: referrer.id,
      paypalEmail: referrer.paypalEmail ?? "",
      amountGbp: PAYOUT_AMOUNT_GBP,
      referralsSnapshot: Number(count),
      status: referrer.paypalEmail ? "owed" : "needs_details",
    })
  }
}

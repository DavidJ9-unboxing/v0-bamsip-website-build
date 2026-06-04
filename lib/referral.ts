import { randomBytes } from "crypto"

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

/** Short, unambiguous, uppercase referral code (e.g. "K7Q2MZ"). */
export function generateReferralCode(len = 6) {
  const bytes = randomBytes(len)
  let out = ""
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

/** Opaque token for double opt-in confirmation links. */
export function generateToken() {
  return randomBytes(24).toString("hex")
}

/** Every REFERRAL_THRESHOLD confirmed referrals earns one PAYOUT_AMOUNT_GBP reward. */
export const REFERRAL_THRESHOLD = 50
export const PAYOUT_AMOUNT_GBP = 5

/**
 * Rewards auto-approve (ready to send) until a single Bammer's cumulative
 * approved/paid total reaches this cap. Anything beyond it is held as
 * "needs_approval" until the approver signs off.
 */
export const AUTO_APPROVE_CAP_GBP = 10

/** Only this person can approve over-cap payouts. */
export const PAYOUT_APPROVER_EMAIL = "natan@bamsip.com"

/** Base URL for building shareable links + confirmation links. */
export function getBaseUrl() {
  return (
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL ?? "http://localhost:3000")
  )
}

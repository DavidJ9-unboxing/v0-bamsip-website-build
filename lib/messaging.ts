import { db } from "@/lib/db"
import { messageLog } from "@/lib/db/schema"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "BamSip <hello@bamsip.com>"

type LogArgs = {
  recipientType: "bammer" | "venue" | "admin"
  recipientId?: number | null
  recipientContact: string
  channel: "email" | "sms"
  template?: string
  subject?: string
  body?: string
  status: "sent" | "failed" | "skipped" | "queued"
  error?: string | null
}

async function log(args: LogArgs) {
  try {
    await db.insert(messageLog).values({
      recipientType: args.recipientType,
      recipientId: args.recipientId ?? null,
      recipientContact: args.recipientContact,
      channel: args.channel,
      template: args.template,
      subject: args.subject,
      body: args.body,
      status: args.status,
      error: args.error ?? null,
    })
  } catch (e) {
    console.log("[v0] messageLog insert failed:", (e as Error).message)
  }
}

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY)
export const smsConfigured = () =>
  Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  )

/** Send an email via Resend. Degrades gracefully (logs "skipped") if unconfigured. */
export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
  text?: string
  recipientType?: LogArgs["recipientType"]
  recipientId?: number | null
  template?: string
}) {
  const base = {
    recipientType: opts.recipientType ?? "bammer",
    recipientId: opts.recipientId,
    recipientContact: opts.to,
    channel: "email" as const,
    template: opts.template,
    subject: opts.subject,
    body: opts.text ?? opts.html,
  }

  if (!emailConfigured()) {
    await log({ ...base, status: "skipped", error: "RESEND_API_KEY not set" })
    return { ok: false, skipped: true as const }
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    })
    if (res.error) throw new Error(res.error.message)
    await log({ ...base, status: "sent" })
    return { ok: true as const }
  } catch (e) {
    await log({ ...base, status: "failed", error: (e as Error).message })
    return { ok: false, error: (e as Error).message }
  }
}

/** Send an SMS via Twilio. Degrades gracefully (logs "skipped") if unconfigured. */
export async function sendSms(opts: {
  to: string
  body: string
  recipientType?: LogArgs["recipientType"]
  recipientId?: number | null
  template?: string
}) {
  const base = {
    recipientType: opts.recipientType ?? "bammer",
    recipientId: opts.recipientId,
    recipientContact: opts.to,
    channel: "sms" as const,
    template: opts.template,
    body: opts.body,
  }

  if (!smsConfigured()) {
    await log({ ...base, status: "skipped", error: "Twilio not configured" })
    return { ok: false, skipped: true as const }
  }

  try {
    const twilio = (await import("twilio")).default
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    )
    await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: opts.to,
      body: opts.body,
    })
    await log({ ...base, status: "sent" })
    return { ok: true as const }
  } catch (e) {
    await log({ ...base, status: "failed", error: (e as Error).message })
    return { ok: false, error: (e as Error).message }
  }
}

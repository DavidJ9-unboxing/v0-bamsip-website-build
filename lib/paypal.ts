/**
 * Minimal PayPal Payouts API client.
 * Uses sandbox by default; set PAYPAL_ENV=live for production.
 * Degrades gracefully: if credentials are missing, returns { skipped: true }.
 */

export const paypalConfigured = () =>
  Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)

function apiBase() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64")
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

/** Send a single payout. Returns batch id on success. */
export async function sendPayout(opts: {
  email: string
  amountGbp: number
  note?: string
  senderItemId: string
}) {
  if (!paypalConfigured()) {
    return { ok: false as const, skipped: true as const }
  }
  try {
    const token = await getAccessToken()
    const res = await fetch(`${apiBase()}/v1/payments/payouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_batch_header: {
          sender_batch_id: `bamsip_${opts.senderItemId}_${Date.now()}`,
          email_subject: "You've earned a BamSip reward!",
          email_message:
            opts.note ?? "Thanks for spreading the word about BamSip.",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: { value: opts.amountGbp.toFixed(2), currency: "GBP" },
            receiver: opts.email,
            note: opts.note ?? "BamSip referral reward",
            sender_item_id: opts.senderItemId,
          },
        ],
      }),
    })
    const data = (await res.json()) as {
      batch_header?: { payout_batch_id?: string }
      message?: string
    }
    if (!res.ok) throw new Error(data.message ?? `PayPal payout failed: ${res.status}`)
    return {
      ok: true as const,
      batchId: data.batch_header?.payout_batch_id ?? null,
    }
  } catch (e) {
    return { ok: false as const, error: (e as Error).message }
  }
}

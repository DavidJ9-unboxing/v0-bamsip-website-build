import { Resend } from "resend"
import pg from "pg"

const VENUE_NAME = "Test Bar"
const TO = "dwolfe.j9@gmail.com"
const FROM = process.env.RESEND_FROM_EMAIL?.trim() || "BamSip <hello@bamsip.com>"

const INTEREST_LINK = "https://www.bamsip.com/venues#interest"
const VENUE_LINK = "https://www.bamsip.com/venues#interest"
const FIRST_NAME = "David"
const YOUR_NAME = "Natan, Founder of BamSip"

const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>BamSip — host a launch night</title>
  <!--[if mso]>
  <style>body,table,td,a{font-family:Arial,Helvetica,sans-serif!important;}</style>
  <![endif]-->
  <style>
    body{margin:0;padding:0;background-color:#0a0a0a;}
    a{color:#ff6b5c;}
    @media only screen and (max-width:600px){
      .container{width:100%!important;}
      .px{padding-left:24px!important;padding-right:24px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;">
  <!-- preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#0a0a0a;font-size:1px;line-height:1px;">
    100 people, their first drink on us. We're picking four Manchester venues to host a launch night.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#141414;border-radius:16px;overflow:hidden;border:1px solid #262626;">

          <!-- header -->
          <tr>
            <td class="px" style="padding:32px 40px 16px 40px;">
              <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">bamsip</span>
              <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8a8a;"> &nbsp;·&nbsp; smarter nights out</span>
            </td>
          </tr>

          <!-- hero image -->
          <tr>
            <td style="padding:0;">
              <img src="https://www.bamsip.com/images/hero-night.png?dpl=dpl_3BpxQPPnik5swLTGYpvdqfTzYckG" width="600" alt="A warm, candle-lit Manchester cocktail bar at night" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>

          <!-- hero headline -->
          <tr>
            <td class="px" style="padding:28px 40px 0 40px;">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:1.25;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                fancy 100 first-time guests — with the first round on us?
              </h1>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td class="px" style="padding:20px 40px 0 40px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#d4d4d4;">
              <p style="margin:0 0 16px 0;">Hi ${FIRST_NAME},</p>

              <p style="margin:0 0 16px 0;">Quick one, and not the pitch you usually get.</p>

              <p style="margin:0 0 16px 0;">We're BamSip — Manchester's new nightlife app (Sacha Lord's an advisor). We're launching this summer and picking <strong style="color:#ffffff;">four venues</strong> to host a launch night.</p>

              <p style="margin:0 0 16px 0;">We bring the crowd and buy the first round for the first 100 through the door. Then for two hours they keep drinking at a discount — paid straight to your till.</p>

              <p style="margin:0 0 16px 0;">To you it's just a busy night taking normal tap payments. It runs on Stripe — we settle the bill, your guests just tap. One free drink each, then it's a full bar on their own money.</p>
            </td>
          </tr>

          <!-- free callout -->
          <tr>
            <td class="px" style="padding:8px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1f1714;border:1px solid #3a2a24;border-radius:12px;">
                <tr>
                  <td style="padding:18px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#e8d9d2;">
                    <strong style="color:#ff8a7a;">BamSip is always free to you.</strong> No subscription, no listing fee, no lock-in. The only thing you ever spend is the discount you choose to put into an offer to pull a crowd — and you decide if, when and how often. Use it every night or once a month.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- what you get -->
          <tr>
            <td class="px" style="padding:24px 40px 0 40px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;">what you get</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:0 0 12px 0;font-size:15px;line-height:1.55;color:#d4d4d4;"><span style="color:#ff6b5c;">›</span>&nbsp; A packed room on a quiet night, zero risk on the bar spend.</td></tr>
                <tr><td style="padding:0 0 12px 0;font-size:15px;line-height:1.55;color:#d4d4d4;"><span style="color:#ff6b5c;">›</span>&nbsp; Real data on what each offer drove in visits, redemptions and spend.</td></tr>
                <tr><td style="padding:0 0 12px 0;font-size:15px;line-height:1.55;color:#d4d4d4;"><span style="color:#ff6b5c;">›</span>&nbsp; An AI-assisted back end that learns your patterns — suggesting the right offers and best times to push them, even firing them automatically when you're quiet if you let it. You're always in control.</td></tr>
                <tr><td style="padding:0 0 4px 0;font-size:15px;line-height:1.55;color:#d4d4d4;"><span style="color:#ff6b5c;">›</span>&nbsp; A wall of new regulars — table tents on the night, plus a QR code afterwards unlocking a welcome offer redeemable only at your venue.</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:20px 40px 0 40px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#d4d4d4;">
              <p style="margin:0;">All we ask for the launch night is a genuine discount on that first round — it's a friends-and-family learning night for us, as much PR as party.</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td class="px" style="padding:28px 40px 8px 40px;" align="left">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:10px;background-color:#ff6b5c;">
                    <a href="${INTEREST_LINK}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#0a0a0a;text-decoration:none;border-radius:10px;">I'm interested →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:8px 40px 24px 40px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#9a9a9a;">
              Just reply "interested" and I'll send dates. Not up for hosting? You can still <a href="${VENUE_LINK}" style="color:#ff6b5c;">register as a BamSip venue here</a>.
            </td>
          </tr>

          <!-- sign off -->
          <tr>
            <td class="px" style="padding:0 40px 32px 40px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#d4d4d4;">
              Cheers,<br>
              <strong style="color:#ffffff;">${YOUR_NAME}</strong><br>
              <span style="color:#9a9a9a;font-size:14px;">BamSip — smarter nights out</span>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#0f0f0f;border-top:1px solid #262626;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6a6a6a;" class="px">
              <a href="https://bamsip.com" style="color:#8a8a8a;text-decoration:none;">bamsip.com</a> &nbsp;·&nbsp; Manchester rollout, now onboarding<br>
              © 2026 Sipacity LLC &nbsp;·&nbsp; <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6a6a6a;text-decoration:underline;">unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

const text = `Hi ${FIRST_NAME},

Quick one, and not the pitch you usually get.

We're BamSip — Manchester's new nightlife app (Sacha Lord's an advisor). We're launching this summer and picking four venues to host a launch night.

We bring the crowd and buy the first round for the first 100 through the door. Then for two hours they keep drinking at a discount — paid straight to your till.

BamSip is always free to you. No subscription, no listing fee, no lock-in.

I'm interested: ${INTEREST_LINK}

Just reply "interested" and I'll send dates. Not up for hosting? Register as a BamSip venue: ${VENUE_LINK}

Cheers,
${YOUR_NAME}
BamSip — smarter nights out`

const apiKey = process.env.RESEND_API_KEY?.trim()
if (!apiKey) {
  console.error("RESEND_API_KEY not set")
  process.exit(1)
}

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Look up Test Bar signup id + venue name for logging and dynamic subject
let recipientId = null
let venueName = VENUE_NAME
try {
  const r = await pool.query(
    "SELECT id, venue_name FROM venue_signups WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
    [TO],
  )
  recipientId = r.rows[0]?.id ?? null
  if (r.rows[0]?.venue_name) venueName = r.rows[0].venue_name
} catch (e) {
  console.log("[v0] lookup failed:", e.message)
}

// Subject is generated dynamically from the venue record (not stored in the HTML template)
const SUBJECT = `Could ${venueName} host a BamSip launch night?`

const resend = new Resend(apiKey)
let status = "sent"
let error = null
try {
  const res = await resend.emails.send({ from: FROM, to: TO, subject: SUBJECT, html, text })
  if (res.error) throw new Error(res.error.message)
  console.log("Sent. Resend id:", res.data?.id)
} catch (e) {
  status = "failed"
  error = e.message
  console.error("Send failed:", e.message)
}

try {
  await pool.query(
    `INSERT INTO message_log (recipient_type, recipient_id, recipient_contact, channel, template, subject, body, status, error)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    ["venue", recipientId, TO, "email", "venue-launch-invite", SUBJECT, html, status, error],
  )
  console.log("Logged to message_log (status:", status + ")")
} catch (e) {
  console.log("[v0] message_log insert failed:", e.message)
}

await pool.end()
process.exit(status === "sent" ? 0 : 1)

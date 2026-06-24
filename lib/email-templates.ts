const SHELL_OPEN = `<div style="font-family:Arial,Helvetica,sans-serif;background:#16110f;padding:32px;color:#f5ece3;border-radius:16px;max-width:520px;margin:0 auto;">`
const SHELL_CLOSE = `<p style="color:#9a8d80;font-size:12px;margin-top:28px;">BamSip · Manchester nights, sorted.</p></div>`
const BTN = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#ff6b54;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;margin:18px 0;">${label}</a>`

export function bammerConfirmEmail(
  name: string,
  confirmUrl: string,
  referralCode: string,
) {
  return `${SHELL_OPEN}
    <h1 style="font-size:22px;margin:0 0 12px;">one tap and you're in, ${escapeHtml(name)} 🎉</h1>
    <p style="line-height:1.6;color:#d9ccc0;">Confirm your spot on the BamSip waitlist. First event lands in Manchester this July, with more all summer into Christmas.</p>
    ${BTN(confirmUrl, "Confirm my spot")}
    <p style="line-height:1.6;color:#d9ccc0;">Want £5? Refer 50 mates who sign up and we'll pay you — for every 50. Your code:</p>
    <p style="font-size:20px;font-weight:bold;letter-spacing:2px;color:#ff6b54;">${referralCode}</p>
    ${SHELL_CLOSE}`
}

export function bammerWelcomeEmail(name: string, shareUrl: string, referralCode: string) {
  return `${SHELL_OPEN}
    <h1 style="font-size:22px;margin:0 0 12px;">you're on the list, ${escapeHtml(name)} 🙌</h1>
    <p style="line-height:1.6;color:#d9ccc0;">We'll let you know the moment tickets for the first Manchester night go live in July.</p>
    <p style="line-height:1.6;color:#d9ccc0;">Share your link — 50 mates who sign up earns you £5 (every 50, repeatable):</p>
    <p style="font-size:16px;font-weight:bold;color:#ff6b54;word-break:break-all;">${shareUrl}</p>
    <p style="color:#9a8d80;font-size:13px;">Your code: <strong>${referralCode}</strong></p>
    ${SHELL_CLOSE}`
}

export function venueConfirmEmail(
  contactName: string,
  venueName: string,
  confirmUrl: string,
) {
  return `${SHELL_OPEN}
    <h1 style="font-size:22px;margin:0 0 12px;">thanks, ${escapeHtml(contactName)}</h1>
    <p style="line-height:1.6;color:#d9ccc0;">We're excited to talk about bringing ${escapeHtml(venueName)} onto BamSip for our Manchester launch this July and the summer run of events.</p>
    <p style="line-height:1.6;color:#d9ccc0;">Confirm your details and our team will reach out within 48 hours.</p>
    ${BTN(confirmUrl, "Confirm interest")}
    ${SHELL_CLOSE}`
}

/* --------------------- Venue outreach / launch emails -------------------- */

/**
 * Default hero used in venue outreach emails. Points at the live site asset.
 * If a custom hero is created later, upload it to
 * /public/images/email-venue-launch-hero.jpg and set the composer's hero field
 * to: https://www.bamsip.com/images/email-venue-launch-hero.jpg
 */
export const VENUE_LAUNCH_HERO =
  "https://www.bamsip.com/images/hero-night.png?dpl=dpl_3BpxQPPnik5swLTGYpvdqfTzYckG"

/** Personalisation tokens supported in venue email subjects and bodies. */
export type VenueEmailVars = {
  venueName: string
  contactName: string
}

/**
 * Replaces {{venueName}}, {{contactName}} and {{firstName}} tokens. Substituted
 * values are HTML-escaped so a venue/contact name can never break the markup.
 */
export function applyVenueTokens(input: string, vars: VenueEmailVars) {
  const venue = escapeHtml(vars.venueName || "your venue")
  const contact = escapeHtml(vars.contactName || "there")
  const first = escapeHtml((vars.contactName || "there").split(/\s+/)[0])
  return input
    .replace(/\{\{\s*venueName\s*\}\}/gi, venue)
    .replace(/\{\{\s*contactName\s*\}\}/gi, contact)
    .replace(/\{\{\s*firstName\s*\}\}/gi, first)
}

/**
 * Content for a venue outreach email. Either the BamSip branded template
 * (structured, on-brand fields) or a raw HTML payload pasted by an admin.
 * Token strings like {{venueName}} are preserved here and substituted per
 * recipient at send time via applyVenueTokens().
 */
export type VenueEmailContent =
  | {
      mode: "template"
      heroUrl?: string
      headline: string
      body: string // plain text; blank lines split paragraphs
      ctaLabel?: string
      ctaUrl?: string
    }
  | {
      mode: "html"
      rawHtml: string
    }

/** Renders the email body to HTML, leaving personalisation tokens intact. */
export function buildVenueEmailHtml(content: VenueEmailContent) {
  if (content.mode === "html") return content.rawHtml

  const hero = content.heroUrl?.trim()
    ? `<img src="${content.heroUrl.trim()}" alt="BamSip — Manchester nights, sorted" style="display:block;width:100%;max-width:520px;height:auto;border-radius:12px;margin:0 0 20px;" />`
    : ""
  const headline = content.headline.trim()
    ? `<h1 style="font-size:22px;margin:0 0 12px;">${escapeHtml(content.headline.trim())}</h1>`
    : ""
  const paragraphs = content.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="line-height:1.6;color:#d9ccc0;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`,
    )
    .join("\n    ")
  const cta =
    content.ctaUrl?.trim() && content.ctaLabel?.trim()
      ? BTN(content.ctaUrl.trim(), escapeHtml(content.ctaLabel.trim()))
      : ""

  return `${SHELL_OPEN}
    ${hero}
    ${headline}
    ${paragraphs}
    ${cta}
    ${SHELL_CLOSE}`
}

/** Sensible default subject for the venue launch campaign (with token). */
export const VENUE_LAUNCH_SUBJECT =
  "{{venueName}} x BamSip: smarter nights out start here"

/** Default branded template content for the venue launch campaign. */
export function defaultVenueLaunchContent(ctaUrl: string): VenueEmailContent {
  return {
    mode: "template",
    heroUrl: VENUE_LAUNCH_HERO,
    headline: "smarter nights out start here",
    body: `Hi {{contactName}},

We're bringing BamSip to Manchester this July and we'd love to put {{venueName}} in front of our crowd. BamSip fills your quieter nights by sending engaged locals your way — no upfront cost, no commitment.

Want to hear how it works for venues like yours?`,
    ctaLabel: "Get the venue details",
    ctaUrl,
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  )
}

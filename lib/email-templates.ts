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

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  )
}

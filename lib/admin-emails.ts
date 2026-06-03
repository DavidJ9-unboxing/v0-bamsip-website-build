/** Emails permitted to access the BamSip admin back-office. */
export const ADMIN_EMAILS = ["natan@bamsip.com", "david.wolfe@journey9.com"]

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { isAdminEmail } from "@/lib/admin-emails"

export { ADMIN_EMAILS, isAdminEmail } from "@/lib/admin-emails"

/**
 * Returns the current session if the user is an authorized admin, otherwise null.
 * Use in server components / actions to gate the admin area.
 */
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) return null
  return session
}

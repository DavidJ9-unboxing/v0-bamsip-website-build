import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { isAdminEmail } from "@/lib/admin-emails"
import { AdminAuthForm } from "@/components/admin-auth-form"

export const metadata = { title: "Admin sign in — BamSip" }

export default async function AdminSignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user && isAdminEmail(session.user.email)) {
    redirect("/admin")
  }
  return <AdminAuthForm />
}

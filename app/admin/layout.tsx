import type React from "react"
import { AdminNav } from "@/components/admin/admin-nav"
import { getAdminSession } from "@/lib/admin"

export const metadata = { title: "Admin — BamSip" }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  // Sign-in page renders without the shell; it handles its own UI/redirect.
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-svh bg-ink text-cream">
      <AdminNav email={session.user.email} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

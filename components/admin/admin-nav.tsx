"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Store,
  Send,
  PoundSterling,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bammers", label: "Bammers", icon: Users },
  { href: "/admin/venues", label: "Venues", icon: Store },
  { href: "/admin/messages", label: "Messages", icon: Send },
  { href: "/admin/payouts", label: "Payouts", icon: PoundSterling },
]

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await authClient.signOut()
    router.push("/admin/sign-in")
    router.refresh()
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink2/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="font-display text-lg font-bold text-cream">
            Bam<span className="text-flame">Sip</span>
          </Link>
          <span className="rounded-full bg-ink3 px-2 py-0.5 text-xs text-mute">
            admin
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(l.href)
                    ? "bg-flame/15 text-flame"
                    : "text-cream2 hover:bg-ink3 hover:text-cream",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="max-w-[160px] truncate text-xs text-mute" title={email}>
            {email}
          </span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-2 text-sm text-cream2 transition-colors hover:bg-ink3 hover:text-cream"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg border border-hairline p-2 text-cream2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-hairline px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => {
              const Icon = l.icon
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
                    isActive(l.href)
                      ? "bg-flame/15 text-flame"
                      : "text-cream2 hover:bg-ink3",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
            <span className="max-w-[180px] truncate text-xs text-mute">{email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-2 text-sm text-cream2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

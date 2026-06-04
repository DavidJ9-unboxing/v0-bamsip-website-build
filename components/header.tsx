"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { BamSipLogo } from "./bamsip-logo"

const navLinks = [
  { label: "for bammers", href: "/bammers" },
  { label: "for venues", href: "/venues" },
  { label: "faq", href: "/#faq" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-hairline bg-ink/70 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BamSipLogo size="md" />

        {/* Desktop nav links — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded text-base font-bold text-cream2 outline-none transition-colors hover:text-cream focus-visible:ring-2 focus-visible:ring-flame"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA — right */}
        <Link
          href="/#waitlist"
          className="hidden items-center gap-1.5 rounded-full bg-flame px-4 py-2 text-sm font-semibold text-cream outline-none transition-all hover:bg-flame-soft focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:inline-flex"
        >
          join waitlist
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-cream outline-none focus-visible:ring-2 focus-visible:ring-flame md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-hairline bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-cream2 transition-colors hover:bg-ink2 hover:text-cream"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#waitlist"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-flame px-4 py-3 text-base font-semibold text-cream"
              >
                join waitlist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

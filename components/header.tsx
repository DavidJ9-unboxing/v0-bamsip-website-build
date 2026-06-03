"use client"

import Link from "next/link"
import { BamSipLogo } from "./bamsip-logo"

interface HeaderProps {
  variant?: "home" | "bammers" | "venues"
}

export function Header({ variant = "home" }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/80 backdrop-blur-md border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BamSipLogo size="md" />

          {variant !== "home" && (
            <nav className="flex items-center gap-6">
              {variant === "bammers" && (
                <Link
                  href="/venues"
                  className="text-sm text-cream2 hover:text-cream transition-colors"
                >
                  for venues
                </Link>
              )}
              {variant === "venues" && (
                <Link
                  href="/bammers"
                  className="text-sm text-cream2 hover:text-cream transition-colors"
                >
                  for bammers
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

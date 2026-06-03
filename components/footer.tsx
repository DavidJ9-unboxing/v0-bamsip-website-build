"use client"

import Link from "next/link"
import { BamSipLogo } from "./bamsip-logo"
import { Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <BamSipLogo size="sm" linkToHome={false} />

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/bammers"
              className="text-mute hover:text-cream transition-colors"
            >
              For Bammers
            </Link>
            <Link
              href="/venues"
              className="text-mute hover:text-cream transition-colors"
            >
              For Venues
            </Link>
            <Link
              href="/privacy"
              className="text-mute hover:text-cream transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-mute hover:text-cream transition-colors"
            >
              Terms
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/bamsipapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mute hover:text-flame transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://tiktok.com/@bamsipapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mute hover:text-flame transition-colors"
              aria-label="TikTok"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/bamsip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mute hover:text-flame transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-hairline text-center">
          <p className="text-sm text-mute">
            © {new Date().getFullYear()} Sipacity LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"

interface BamSipLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  linkToHome?: boolean
}

export function BamSipLogo({
  className = "",
  size = "md",
  linkToHome = true,
}: BamSipLogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  }

  const Logo = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Connection Mark Symbol */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClasses[size]}
      >
        {/* Left circle */}
        <circle
          cx="14"
          cy="20"
          r="10"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        {/* Right circle */}
        <circle
          cx="26"
          cy="20"
          r="10"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        {/* Coral node at intersection */}
        <circle cx="20" cy="20" r="4" fill="#FF6B6B" />
      </svg>
      {/* Wordmark */}
      <span className="font-bold text-cream tracking-tight">
        Bam
        <span className="relative">
          S
          <span className="text-flame">i</span>p
        </span>
      </span>
    </div>
  )

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex">
        <Logo />
      </Link>
    )
  }

  return <Logo />
}

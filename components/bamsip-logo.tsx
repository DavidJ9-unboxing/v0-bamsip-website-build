"use client"

import Link from "next/link"

interface BamSipLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  linkToHome?: boolean
}

const sizeClasses = {
  sm: { mark: "h-6 w-6", text: "text-lg" },
  md: { mark: "h-8 w-8", text: "text-xl" },
  lg: { mark: "h-10 w-10", text: "text-2xl" },
}

export function ChainMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Two interlocking ring links with an over/under weave */}
      <defs>
        <clipPath id="bamsip-weave-top">
          <circle cx="24" cy="16" r="5.5" />
        </clipPath>
      </defs>
      {/* left link (cream) */}
      <circle
        cx="18"
        cy="24"
        r="10"
        stroke="var(--cream)"
        strokeWidth="3.6"
      />
      {/* right link (flame) — sits over the left at the bottom crossing */}
      <circle
        cx="30"
        cy="24"
        r="10"
        stroke="var(--flame)"
        strokeWidth="3.6"
      />
      {/* redraw the left link only at the top crossing so it weaves over */}
      <circle
        cx="18"
        cy="24"
        r="10"
        stroke="var(--cream)"
        strokeWidth="3.6"
        clipPath="url(#bamsip-weave-top)"
      />
    </svg>
  )
}

export function BamSipLogo({
  className = "",
  size = "md",
  linkToHome = true,
}: BamSipLogoProps) {
  const s = sizeClasses[size]

  const Logo = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <ChainMark className={s.mark} />
      <span
        className={`font-display font-bold tracking-tight text-cream ${s.text}`}
      >
        bam<span className="text-flame">sip</span>
      </span>
    </div>
  )

  if (linkToHome) {
    return (
      <Link
        href="/"
        className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-flame"
        aria-label="BamSip home"
      >
        <Logo />
      </Link>
    )
  }

  return <Logo />
}

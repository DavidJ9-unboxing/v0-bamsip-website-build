"use client"

import type { ReactNode } from "react"

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

/**
 * iPhone 15 Pro style frame. The screen area is a fixed aspect container
 * so app screens can fill it edge-to-edge.
 */
export function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`relative w-[300px] max-w-full rounded-[3rem] border border-white/10 bg-[#202028] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* Titanium edge highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5" />

      {/* Screen */}
      <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.25rem] bg-ink">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  )
}

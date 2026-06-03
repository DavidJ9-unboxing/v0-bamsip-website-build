"use client"

import { motion } from "framer-motion"

/**
 * Generative nightlife backdrop: deep black base, drifting coral bloom,
 * warm amber haze, faint violet depth, a sparse data-point grid, and grain.
 * Manchester-at-night feel without literal stock photography.
 */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-ink">
      {/* Coral bloom */}
      <motion.div
        className="absolute -top-32 left-1/2 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(255,107,84,0.30), transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Amber haze */}
      <motion.div
        className="absolute top-40 -right-20 h-[30rem] w-[30rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(255,181,71,0.18), transparent 70%)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Violet depth */}
      <motion.div
        className="absolute bottom-0 -left-24 h-[28rem] w-[28rem] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.16), transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Faint map / data-point grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.5]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="dots"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Grain + vignette */}
      <div className="grain absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(10,10,15,0.85) 100%)",
        }}
      />
    </div>
  )
}

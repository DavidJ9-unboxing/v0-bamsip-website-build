"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BamSipLogo } from "@/components/bamsip-logo"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink flex flex-col">
      {/* Header */}
      <header className="p-6">
        <BamSipLogo size="md" linkToHome={false} />
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center">
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-cream tracking-tight lowercase mb-6">
              BAMSIP
            </h1>
            <p className="text-xl sm:text-2xl text-cream2 font-medium mb-4">
              one app. two sides. both get paid.
            </p>
            <p className="text-base sm:text-lg text-mute">
              {"Manchester's new nightlife marketplace. Pick your side."}
            </p>
          </motion.div>

          {/* Chooser cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Bammers card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/bammers" className="block group">
                <div className="relative p-8 rounded-2xl border-2 border-flame/40 bg-ink2 transition-all duration-300 hover:border-flame hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,107,107,0.15)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-cream">
                      For Bammers
                    </h2>
                    <ArrowRight className="w-5 h-5 text-flame transition-transform group-hover:translate-x-1" />
                  </div>
                  <ul className="space-y-3 text-left">
                    <li className="text-cream2 text-sm">pre-buy drinks.</li>
                    <li className="text-cream2 text-sm">skip queues.</li>
                    <li className="text-cream2 text-sm">
                      flash deals all night.
                    </li>
                  </ul>
                </div>
              </Link>
            </motion.div>

            {/* Venues card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/venues" className="block group">
                <div className="relative p-8 rounded-2xl border-2 border-amber/40 bg-ink2 transition-all duration-300 hover:border-amber hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(245,166,35,0.15)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-cream">For Venues</h2>
                    <ArrowRight className="w-5 h-5 text-amber transition-transform group-hover:translate-x-1" />
                  </div>
                  <ul className="space-y-3 text-left">
                    <li className="text-cream2 text-sm">fill dead hours.</li>
                    <li className="text-cream2 text-sm">push live offers.</li>
                    <li className="text-cream2 text-sm">
                      see what actually worked.
                    </li>
                  </ul>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-mute">
          built with{" "}
          <span className="text-cream2 font-medium">Sacha Lord</span> & the{" "}
          <span className="text-cream2 font-medium">
            UK Night Time Industries Association
          </span>
        </p>
      </footer>
    </main>
  )
}

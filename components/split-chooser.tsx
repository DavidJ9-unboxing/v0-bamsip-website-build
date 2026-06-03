"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Beer, Store } from "lucide-react"
import { images } from "@/lib/images"

const cards = [
  {
    href: "/bammers",
    label: "For Bammers",
    tagline: "going out",
    icon: Beer,
    accent: "flame" as const,
    image: images.toast,
    lines: ["themed events & live music.", "bammer-only nights.", "drinks pre-bought for less."],
    cta: "explore the app",
  },
  {
    href: "/venues",
    label: "For Venues",
    tagline: "running a venue",
    icon: Store,
    accent: "amber" as const,
    image: images.barInterior,
    lines: ["fill your dead nights.", "protect your margin.", "see what actually worked."],
    cta: "see the operator tool",
  },
]

export function SplitChooser() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
          one app. two sides. everyone wins.
        </h2>
        <p className="mt-3 text-cream2">
          pick your side and see what BamSip does for you.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {cards.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={card.href} className="group block h-full">
              <div
                className={`relative h-full overflow-hidden rounded-3xl border bg-ink2 transition-all duration-300 hover:-translate-y-1 ${
                  card.accent === "flame"
                    ? "border-flame/25 hover:border-flame/60 hover:shadow-[0_0_50px_-12px_rgba(255,107,84,0.45)]"
                    : "border-amber/25 hover:border-amber/60 hover:shadow-[0_0_50px_-12px_rgba(255,181,71,0.4)]"
                }`}
              >
                {/* Image header */}
                <div className="relative h-44 overflow-hidden sm:h-52">
                  <Image
                    src={card.image.src || "/placeholder.svg"}
                    alt={card.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink2 via-ink2/40 to-transparent" />
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${
                      card.accent === "flame"
                        ? "bg-flame/20 text-flame"
                        : "bg-amber/20 text-amber"
                    }`}
                  >
                    {card.tagline}
                  </span>
                </div>

                <div className="p-8 pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        card.accent === "flame"
                          ? "bg-flame/15 text-flame"
                          : "bg-amber/15 text-amber"
                      }`}
                    >
                      <card.icon className="h-6 w-6" />
                    </div>
                    <ArrowRight
                      className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                        card.accent === "flame" ? "text-flame" : "text-amber"
                      }`}
                    />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-cream">
                    {card.label}
                  </h3>
                  <ul className="mt-4 space-y-1.5">
                    {card.lines.map((line) => (
                      <li key={line} className="text-cream2">
                        {line}
                      </li>
                    ))}
                  </ul>
                  <span
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
                      card.accent === "flame" ? "text-flame" : "text-amber"
                    }`}
                  >
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

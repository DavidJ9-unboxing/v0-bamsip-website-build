"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { images, galleryImages } from "@/lib/images"

const captions: Record<string, string> = {
  crowd: "big nights, sorted",
  cocktails: "drinks, locked in",
  barInterior: "the city's best rooms",
  live: "what's on tonight",
  bartender: "no queue, no faff",
  street: "Manchester after dark",
  toast: "plan with mates",
  heroNight: "your next round",
}

export function GalleryMarquee() {
  // Duplicate the list so the track can loop seamlessly.
  const loop = [...galleryImages, ...galleryImages]

  return (
    <section className="relative overflow-hidden py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-10 max-w-2xl px-4 text-center"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-flame">
          this is the night
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-balance text-cream sm:text-4xl">
          the good stuff, every night of the week.
        </h2>
      </motion.div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <div className="marquee-pause flex w-full overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-4 pr-4">
          {loop.map((key, i) => {
            const img = images[key]
            return (
              <figure
                key={`${key}-${i}`}
                className="group relative h-64 w-80 shrink-0 overflow-hidden rounded-2xl border border-hairline sm:h-72 sm:w-96"
              >
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 320px, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 font-display text-lg font-semibold lowercase text-cream">
                  {captions[key]}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}

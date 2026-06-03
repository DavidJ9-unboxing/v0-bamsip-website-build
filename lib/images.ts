// Central manifest for the BamSip nightlife image library.
// All images live in /public/images and are warm, premium, coral/amber-lit
// Manchester nightlife scenes — tasteful, not stock-cheesy.

export const images = {
  heroNight: {
    src: "/images/hero-night.png",
    alt: "A warm, candle-lit Manchester cocktail bar glowing amber at night",
  },
  cocktails: {
    src: "/images/cocktails.png",
    alt: "Two signature cocktails on a dark bar top under warm coral light",
  },
  crowd: {
    src: "/images/crowd.png",
    alt: "A group of friends laughing together over drinks at a bar",
  },
  barInterior: {
    src: "/images/bar-interior.png",
    alt: "An upscale cocktail bar interior with a glowing, bottle-lined backbar",
  },
  bartender: {
    src: "/images/bartender.png",
    alt: "A bartender pouring a cocktail behind a warmly lit bar",
  },
  street: {
    src: "/images/street.png",
    alt: "A Manchester Northern Quarter street at night with neon reflections on wet pavement",
  },
  live: {
    src: "/images/live.png",
    alt: "An intimate live music venue glowing warm amber with a lively crowd",
  },
  toast: {
    src: "/images/toast.png",
    alt: "Friends clinking cocktail glasses together in a toast",
  },
} as const

export type ImageKey = keyof typeof images

// Ordered set used for the scrolling gallery marquee.
export const galleryImages: ImageKey[] = [
  "crowd",
  "cocktails",
  "barInterior",
  "live",
  "bartender",
  "street",
  "toast",
  "heroNight",
]

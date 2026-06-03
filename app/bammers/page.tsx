import type { Metadata } from "next"
import { BammersContent } from "./content"

export const metadata: Metadata = {
  title: "Smarter nights out. — BamSip",
  description:
    "Themed events, live music and bammer-only nights — with your drinks pre-bought for less. Manchester nightlife, sorted with your mates.",
  openGraph: {
    title: "Smarter nights out. — BamSip",
    description:
      "Themed events, live music and bammer-only nights — with your drinks pre-bought for less. Manchester nightlife, sorted with your mates.",
  },
}

export default function BammersPage() {
  return <BammersContent />
}

import type { Metadata } from "next"
import { BammersContent } from "./content"

export const metadata: Metadata = {
  title: "Smarter nights out. — BamSip",
  description:
    "Pre-buy drinks at a discount, skip the queue, and grab flash deals all night.",
  openGraph: {
    title: "Smarter nights out. — BamSip",
    description:
      "Pre-buy drinks at a discount, skip the queue, and grab flash deals all night.",
  },
}

export default function BammersPage() {
  return <BammersContent />
}

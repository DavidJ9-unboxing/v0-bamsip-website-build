import type { Metadata } from "next"
import { VenuesContent } from "./content"

export const metadata: Metadata = {
  title: "Fill your dead nights. — BamSip for venues",
  description:
    "Live offers, pre-sold drinks, and real attribution. Turn quiet hours into revenue.",
  openGraph: {
    title: "Fill your dead nights. — BamSip for venues",
    description:
      "Live offers, pre-sold drinks, and real attribution. Turn quiet hours into revenue.",
  },
}

export default function VenuesPage() {
  return <VenuesContent />
}

import type { Metadata } from "next"
import { VenuesContent } from "./content"

export const metadata: Metadata = {
  title: "Fill your dead nights. — BamSip for venues",
  description:
    "Live offers, pre-sold drinks, real attribution. Built with Sacha Lord & NTIA.",
  openGraph: {
    title: "Fill your dead nights. — BamSip for venues",
    description:
      "Live offers, pre-sold drinks, real attribution. Built with Sacha Lord & NTIA.",
  },
}

export default function VenuesPage() {
  return <VenuesContent />
}

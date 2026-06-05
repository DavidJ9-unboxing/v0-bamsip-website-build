import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomeHero } from "@/components/home-hero"
import { GalleryMarquee } from "@/components/gallery-marquee"
import { SplitChooser } from "@/components/split-chooser"
import { EventTimeline } from "@/components/event-timeline"
import { TrustBand } from "@/components/trust-band"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main>
        <HomeHero />
        <GalleryMarquee />
        <SplitChooser />
        <EventTimeline />
        <TrustBand />
      </main>
      <Footer />
    </div>
  )
}

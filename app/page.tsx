import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomeHero } from "@/components/home-hero"
import { GalleryMarquee } from "@/components/gallery-marquee"
import { SplitChooser } from "@/components/split-chooser"
import { DemoSection } from "@/components/demo-section"
import { HowItWorks } from "@/components/how-it-works"
import { VenuesTeaser } from "@/components/venues-teaser"
import { TrustBand } from "@/components/trust-band"
import { FAQ } from "@/components/faq"
import { FinalCta } from "@/components/final-cta"

const howItWorksSteps = [
  {
    number: 1,
    headline: "discover what's live",
    body: "open the map, filter by vibe, see every deal dropping near you tonight.",
  },
  {
    number: 2,
    headline: "pre-buy before you arrive",
    body: "lock in your drinks at a discount. pay less, skip the bar queue.",
  },
  {
    number: 3,
    headline: "tap to redeem at the bar",
    body: "hold your phone to the reader. sorted. show the bar and sip.",
  },
]

const faqItems = [
  {
    question: "When is BamSip available?",
    answer:
      "Manchester first — we're onboarding venues now ahead of the rollout. Drop your city when you sign up and we'll let you know when we land near you.",
  },
  {
    question: "Is BamSip free to use?",
    answer:
      "Yes. Free to download, free to use. You only pay for the drinks you pre-buy — at a discount.",
  },
  {
    question: "How do flash deals work?",
    answer:
      "Venues push live offers when they want to fill a quiet window. You see them in real time, locked to a cap and a time window so they never get devalued.",
  },
  {
    question: "Can I plan with friends?",
    answer:
      "Share a venue, a deal, or a whole night to the group chat in one tap. Everyone arrives ready.",
  },
  {
    question: "What if my venue isn't listed?",
    answer:
      "Tell us — there's a request field after you sign up. We're adding Manchester venues every week.",
  },
  {
    question: "What does BamSip cost a venue?",
    answer:
      "We're finalising pricing before launch — likely a share of redemptions, no monthly fee. Register interest to be part of the conversation.",
  },
  {
    question: "Do venues control pricing?",
    answer:
      "Always. You set the offer, the cap, the time window, and the visibility. BamSip never auto-discounts on your behalf.",
  },
  {
    question: "How fast can a venue go live?",
    answer:
      "Around 15 minutes to onboard, then 15 seconds to push a live offer once you're in.",
  },
  {
    question: "Does it integrate with EPOS?",
    answer:
      "Day one it's a redemption at the bar. Integrations with major EPOS systems are on the roadmap.",
  },
  {
    question: "Who owns the customer relationship?",
    answer:
      "The venue does. BamSip is the channel — customers redeem at your bar, your way.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main>
        <HomeHero />
        <GalleryMarquee />
        <SplitChooser />
        <DemoSection />
        <HowItWorks steps={howItWorksSteps} />
        <VenuesTeaser />
        <TrustBand />
        <div id="faq" className="scroll-mt-16">
          <FAQ items={faqItems} />
        </div>
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

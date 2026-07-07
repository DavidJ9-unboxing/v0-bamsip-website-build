import { VenueHero } from "@/components/venue-hero"

export const metadata = {
  title: "Venue hero preview",
  robots: { index: false, follow: false },
}

export default function VenueHeroPreviewPage() {
  return (
    <main className="min-h-dvh bg-[#0A0A0A] px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Venue hero</h1>
          <p className="mt-1 text-sm text-white/60">
            Same frame for every venue — pass{" "}
            <code className="text-[#FF8A7A]">venueName</code> and{" "}
            <code className="text-[#FF8A7A]">venuePhoto</code>.
          </p>
        </div>

        <VenueHero venueName="Society Manchester" venuePhoto="/images/venue-photos/society-manchester.png" />

        {/* Smaller export size to confirm the cqw-based text holds its proportions. */}
        <div className="max-w-md">
          <VenueHero venueName="Society Manchester" venuePhoto="/images/venue-photos/society-manchester.png" />
        </div>
      </div>
    </main>
  )
}

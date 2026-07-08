/**
 * VenueHero — the consistent hero frame across every venue's outreach email.
 *
 * One continuous photo of the venue is split down the middle: the LEFT half is
 * rendered "dead" (a quiet Tuesday) and the RIGHT half "alive" (with BamSip).
 * A coral divider separates the two states. Everything is sized in container
 * query units (cqw) so the frame holds its proportions at any export size.
 *
 * Personalise with two props: `venueName` and `venuePhoto`.
 */

// Palette (per brief)
const CHARCOAL = "#0A0A0A"
const CORAL = "#FF6B5C"
const CORAL_LIGHT = "#FF8A7A"
const MUTED = "#9C9CA3"

// Shared legibility shadow for overlay text sitting over photography.
const TEXT_SHADOW = "0 0.15cqw 0.7cqw rgba(0,0,0,0.7)"

export function VenueHero({
  venueName,
  venuePhoto,
  className,
}: {
  venueName: string
  venuePhoto: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        // container-type enables the cqw units used throughout.
        containerType: "inline-size",
        position: "relative",
        width: "100%",
        aspectRatio: "1200 / 640",
        overflow: "hidden",
        background: CHARCOAL,
        borderRadius: "1cqw",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* LEFT half — the same photo, rendered "dead". */}
      <div style={{ position: "absolute", insetBlock: 0, left: 0, width: "50%", overflow: "hidden" }}>
        <img
          src={venuePhoto || "/placeholder.svg"}
          alt={`${venueName} interior`}
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            insetBlock: 0,
            left: 0,
            height: "100%",
            width: "200%",
            maxWidth: "none",
            objectFit: "cover",
            filter: "grayscale(1) brightness(0.45) contrast(1.05)",
          }}
        />
      </div>

      {/* RIGHT half — the same photo, rendered "alive". */}
      <div style={{ position: "absolute", insetBlock: 0, right: 0, width: "50%", overflow: "hidden" }}>
        <img
          src={venuePhoto || "/placeholder.svg"}
          alt=""
          aria-hidden="true"
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            insetBlock: 0,
            right: 0,
            height: "100%",
            width: "200%",
            maxWidth: "none",
            objectFit: "cover",
            filter: "saturate(1.3) brightness(1.06)",
          }}
        />
      </div>

      {/* Legibility gradient: slight top darken + strong bottom fade to charcoal. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0) 20%, rgba(10,10,10,0) 52%, rgba(10,10,10,0.55) 78%, rgba(10,10,10,0.9) 100%)",
        }}
      />

      {/* Coral divider with a soft glow either side. */}
      <div
        style={{
          position: "absolute",
          insetBlock: "5.5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0.18cqw",
          minWidth: "1px",
          background: CORAL,
          boxShadow: `0 0 1.2cqw 0.2cqw rgba(255,107,92,0.45)`,
        }}
      />

      {/* Wordmark, top-left. */}
      <div
        style={{
          position: "absolute",
          top: "5.5cqw",
          left: "3.6cqw",
          display: "flex",
          alignItems: "baseline",
          gap: "0.9cqw",
          textShadow: TEXT_SHADOW,
        }}
      >
        <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "2.85cqw", letterSpacing: "-0.03em" }}>
          bamsip
        </span>
        <span style={{ color: MUTED, fontWeight: 500, fontSize: "1.55cqw" }}>smarter nights out</span>
      </div>

      {/* Bottom-left label, over the dim side. */}
      <span
        style={{
          position: "absolute",
          bottom: "4.4cqw",
          left: "3.6cqw",
          color: "rgba(229,229,234,0.8)",
          fontWeight: 600,
          fontSize: "2.15cqw",
          letterSpacing: "0.02em",
          textShadow: TEXT_SHADOW,
        }}
      >
        a quiet tuesday
      </span>

      {/* Bottom-right label, over the vibrant side. */}
      <span
        style={{
          position: "absolute",
          bottom: "4.4cqw",
          left: "52.4cqw",
          color: "#FFFFFF",
          fontWeight: 800,
          fontSize: "2.15cqw",
          letterSpacing: "0.02em",
          textShadow: TEXT_SHADOW,
        }}
      >
        with bamsip
      </span>

      {/* Right-side value block: stacked, right-aligned, vertically centred. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "3.6cqw",
          transform: "translateY(-52%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          textShadow: TEXT_SHADOW,
        }}
      >
        <span style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "2.6cqw", letterSpacing: "-0.01em" }}>
          {venueName}
        </span>
        <span
          style={{
            color: CORAL_LIGHT,
            fontWeight: 800,
            fontSize: "clamp(2rem, 10cqw, 12rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            marginBlock: "0.2cqw",
          }}
        >
          100
        </span>
        <span style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "2.35cqw", letterSpacing: "-0.01em" }}>
          first rounds, on us
        </span>
        <span style={{ color: MUTED, fontWeight: 500, fontSize: "1.55cqw", marginTop: "0.4cqw" }}>
          we bring the crowd, you set the offers
        </span>
      </div>
    </div>
  )
}

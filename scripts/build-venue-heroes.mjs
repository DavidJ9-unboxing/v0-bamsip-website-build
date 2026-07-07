// Composites the BamSip hero frame over each source photo.
// Identical frame across all venues (1200x640); only the photo changes.
import sharp from "sharp"
import { mkdir } from "node:fs/promises"

const W = 1200, H = 640, HALF = W / 2

// Palette (per brief) — must match components/venue-hero.tsx
const CHARCOAL = "#0A0A0A"
const CORAL = "#FF6B5C"
const CORAL_LIGHT = "#FF8A7A"
const MUTED = "#9C9CA3"
const CREAM = "#E5E5EA"
const FONT = "Noto Sans"

// Source photos live here (one PNG per venue, named to match the output file).
// Add the remaining venues' photos here and extend VENUES below to batch them.
const SRC = "scripts/venue-hero-sources"
const OUT = "public/images/venues"

// `name` is drawn into the right-hand value block, matching the `venueName`
// prop of the <VenueHero /> React component.
const VENUES = [
  { file: "joshua-brooks.png", name: "Joshua Brooks" },
  { file: "crazy-pedros.png", name: "Crazy Pedro's" },
  { file: "new-york-new-york.png", name: "New York New York" },
  { file: "twenty-twenty-two.png", name: "Twenty Twenty Two" },
  { file: "society-manchester.png", name: "Society Manchester" },
]

// ── Bottom-up charcoal gradient (legibility) + slight top darken ──────────────
function gradientSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="btm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.52" stop-color="${CHARCOAL}" stop-opacity="0"/>
        <stop offset="0.78" stop-color="${CHARCOAL}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${CHARCOAL}" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${CHARCOAL}" stop-opacity="0.5"/>
        <stop offset="0.2" stop-color="${CHARCOAL}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#btm)"/>
    <rect width="${W}" height="${H}" fill="url(#top)"/>
  </svg>`)
}

// Escape text for safe inclusion in SVG.
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// Wordmark, divider (coral + glow), before/after labels and the right-hand
// value block (venue name, "100", strapline). Mirrors components/venue-hero.tsx.
// Sizes are the cqw values from the component converted to px (1cqw = W/100 = 12px).
function frameSvg(name) {
  const RX = W - 44 // right anchor for the value block (3.6cqw inset ≈ 43px)
  const shadow = "url(#txtShadow)"
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <!-- legibility shadow behind overlay text, matching the component's text-shadow -->
      <filter id="txtShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.7"/>
      </filter>
    </defs>

    <!-- centre divider: faint coral glow either side + crisp 2px coral line -->
    <line x1="${HALF}" y1="35" x2="${HALF}" y2="${H - 35}" stroke="${CORAL}" stroke-opacity="0.45" stroke-width="12" filter="url(#soft)"/>
    <line x1="${HALF}" y1="35" x2="${HALF}" y2="${H - 35}" stroke="${CORAL}" stroke-width="2"/>

    <!-- wordmark top-left -->
    <text x="44" y="68" font-family="${FONT}" font-weight="800" font-size="34" fill="#FFFFFF" letter-spacing="-1" filter="${shadow}">bamsip<tspan font-weight="500" fill="${MUTED}" font-size="19" dx="11">smarter nights out</tspan></text>

    <!-- before/after labels -->
    <text x="44" y="${H - 44}" font-family="${FONT}" font-weight="600" font-size="26" fill="${CREAM}" fill-opacity="0.8" letter-spacing="0.5" filter="${shadow}">a quiet tuesday</text>
    <text x="${HALF + 29}" y="${H - 44}" font-family="${FONT}" font-weight="800" font-size="26" fill="#FFFFFF" letter-spacing="0.5" filter="${shadow}">with bamsip</text>

    <!-- right-hand value block: venue name, big coral "100", strapline -->
    <g text-anchor="end" filter="${shadow}">
      <text x="${RX}" y="232" font-family="${FONT}" font-weight="600" font-size="31" fill="#FFFFFF" letter-spacing="-0.3">${esc(name)}</text>
      <text x="${RX}" y="356" font-family="${FONT}" font-weight="800" font-size="132" fill="${CORAL_LIGHT}" letter-spacing="-4">100</text>
      <text x="${RX}" y="398" font-family="${FONT}" font-weight="600" font-size="28" fill="#FFFFFF" letter-spacing="-0.3">first rounds, on us</text>
      <text x="${RX}" y="424" font-family="${FONT}" font-weight="500" font-size="19" fill="${MUTED}">we bring the crowd — you set the offers</text>
    </g>
  </svg>`)
}

async function build({ file, name }) {
  const src = `${SRC}/${file}`
  const out = `${OUT}/${file}`
  const base = await sharp(src).resize(W, H, { fit: "cover" }).png().toBuffer()

  // One continuous photo, split down the middle. Filters mirror the component:
  //   left  → grayscale(1) brightness(0.45) contrast(1.05)  ("a quiet tuesday")
  //   right → saturate(1.3) brightness(1.06)                ("with bamsip")
  const left = await sharp(base)
    .extract({ left: 0, top: 0, width: HALF, height: H })
    .grayscale()
    .modulate({ brightness: 0.45 })
    .linear(1.05, -(128 * 0.05)) // contrast 1.05
    .png().toBuffer()
  const right = await sharp(base)
    .extract({ left: HALF, top: 0, width: HALF, height: H })
    .modulate({ brightness: 1.06, saturation: 1.3 })
    .png().toBuffer()

  let buf = await sharp({ create: { width: W, height: H, channels: 4, background: "#000" } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: HALF, top: 0 }])
    .png().toBuffer()

  buf = await sharp(buf).composite([{ input: gradientSvg(), blend: "over" }]).png().toBuffer()
  await sharp(buf).composite([{ input: frameSvg(name), blend: "over" }]).png().toFile(out)
  console.log("[v0] built", out)
}

await mkdir(OUT, { recursive: true })
for (const v of VENUES) await build(v)
console.log("[v0] done")

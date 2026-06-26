// Composites the BamSip hero frame over each source photo.
// Identical frame across all venues; only the photo (and +100 "loud" flag) change.
import sharp from "sharp"
import { mkdir } from "node:fs/promises"

const W = 1200, H = 640, HALF = W / 2
const CORAL = "#FF6B54"
const CREAM = "#E5E5EA"
const FONT = "Noto Sans"

// Source photos live here (one PNG per venue, named to match the output file).
// Add the remaining venues' photos here and extend VENUES below to batch them.
const SRC = "scripts/venue-hero-sources"
const OUT = "public/images/venues"

const VENUES = [
  { file: "joshua-brooks.png" },
  { file: "crazy-pedros.png", loud: true },
  { file: "new-york-new-york.png" },
  { file: "twenty-twenty-two.png" },
  { file: "society-manchester.png" },
]

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// Bottom-up charcoal gradient (legibility) + subtle top darkening for the wordmark/pill.
function gradientSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="btm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.38" stop-color="#0A0A0A" stop-opacity="0"/>
        <stop offset="0.78" stop-color="#0A0A0A" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#0A0A0A" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0A0A0A" stop-opacity="0.55"/>
        <stop offset="0.2" stop-color="#0A0A0A" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#btm)"/>
    <rect width="${W}" height="${H}" fill="url(#top)"/>
  </svg>`)
}

// Whole-image coral wash — this is what unifies the set (composited with soft-light).
function washSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${CORAL}" fill-opacity="0.16"/>
  </svg>`)
}

// Soft coral glow over the "with bamsip" (right) half.
function glowSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="0.75" cy="0.5" r="0.6">
        <stop offset="0" stop-color="${CORAL}" stop-opacity="0.42"/>
        <stop offset="1" stop-color="${CORAL}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="${HALF}" y="0" width="${HALF}" height="${H}" fill="url(#g)"/>
  </svg>`)
}

// Wordmark, pill, divider, before/after labels and the +100 motif.
function frameSvg(loud) {
  const plusSize = loud ? 104 : 72
  const plusSub = loud ? 22 : 18
  const glow = loud
    ? `<text x="${W - 44}" y="540" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${plusSize}" fill="${CORAL}" opacity="0.35" style="filter:blur(6px)">+100</text>`
    : ""
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <!-- before/after divider -->
    <line x1="${HALF}" y1="40" x2="${HALF}" y2="${H - 40}" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="2"/>
    <line x1="${HALF}" y1="40" x2="${HALF}" y2="${H - 40}" stroke="${CORAL}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="2 10"/>

    <!-- wordmark top-left -->
    <text x="44" y="70" font-family="${FONT}" font-weight="800" font-size="38" fill="#FFFFFF" letter-spacing="-1">bamsip</text>

    <!-- "1 of 4" pill top-right -->
    <rect x="${W - 168}" y="36" width="128" height="42" rx="21" fill="${CORAL}"/>
    <text x="${W - 104}" y="64" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="20" fill="#0A0A0A">1 of 4</text>

    <!-- before/after labels -->
    <text x="44" y="${H - 44}" font-family="${FONT}" font-weight="600" font-size="26" fill="${CREAM}" letter-spacing="0.5">a quiet tuesday</text>
    <text x="${HALF + 24}" y="${H - 44}" font-family="${FONT}" font-weight="700" font-size="26" fill="${CORAL}" letter-spacing="0.5">with bamsip</text>

    <!-- +100 motif lower-right -->
    ${glow}
    <text x="${W - 44}" y="${H - 70}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${plusSize}" fill="${CORAL}">+100</text>
    <text x="${W - 44}" y="${H - 44}" text-anchor="end" font-family="${FONT}" font-weight="600" font-size="${plusSub}" fill="${CREAM}">first round, on us</text>
  </svg>`)
}

async function build({ file, loud }) {
  const src = `${SRC}/${file}`
  const out = `${OUT}/${file}`
  const base = await sharp(src).resize(W, H, { fit: "cover" }).png().toBuffer()

  // Before/after split: left dimmed (quiet), right warmed (with bamsip).
  const left = await sharp(base)
    .extract({ left: 0, top: 0, width: HALF, height: H })
    .modulate({ brightness: 0.5, saturation: 0.62 })
    .png().toBuffer()
  const right = await sharp(base)
    .extract({ left: HALF, top: 0, width: HALF, height: H })
    .modulate({ brightness: 1.12, saturation: 1.3 })
    .png().toBuffer()

  let buf = await sharp({ create: { width: W, height: H, channels: 4, background: "#000" } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: HALF, top: 0 }])
    .png().toBuffer()

  buf = await sharp(buf).composite([{ input: glowSvg(), blend: "soft-light" }]).png().toBuffer()
  buf = await sharp(buf).composite([{ input: washSvg(), blend: "soft-light" }]).png().toBuffer()
  buf = await sharp(buf).composite([{ input: gradientSvg(), blend: "over" }]).png().toBuffer()
  await sharp(buf).composite([{ input: frameSvg(loud), blend: "over" }]).png().toFile(out)
  console.log("[v0] built", out, loud ? "(loud)" : "")
}

await mkdir(OUT, { recursive: true })
for (const v of VENUES) await build(v)
console.log("[v0] done")

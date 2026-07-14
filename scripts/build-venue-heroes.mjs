// Composites the BamSip hero frame over each source photo.
// Identical frame across all venues (1200x640); only the photo changes.
import sharp from "sharp"
import { mkdir } from "node:fs/promises"

const W = 1200, H = 640, HALF = W / 2

// Palette (per brief)
const CHARCOAL = "#0A0A0A"
const CORAL = "#FF6B5C"
const CORAL_LIGHT = "#FF8A7A"
const AMBER = "#FFB877"
const COOL = "#28323e"
const CREAM = "#E5E5EA"
const FONT = "Noto Sans"

// Source photos live here (one PNG per venue, named to match the output file).
// Add the remaining venues' photos here and extend VENUES below to batch them.
const SRC = "scripts/venue-hero-sources"
const OUT = "public/images/venues"

const VENUES = [
  { file: "joshua-brooks.png" },
  { file: "crazy-pedros.png" },
  { file: "new-york-new-york.png" },
  { file: "twenty-twenty-two.png" },
  { file: "society-manchester.png" },
  // Second wave (from BamSip Venue Heroes 2 — one source photo per venue).
  { file: "256-wilmslow-road.png" },
  { file: "bar-fringe.png" },
  { file: "brickhouse-social.png" },
  { file: "house-of-social.png" },
  { file: "jimmys-nq.png" },
  { file: "lock-91.png" },
  { file: "new-union-hotel.png" },
  { file: "north-taproom.png" },
  { file: "piccadilly-tap.png" },
  { file: "sandinista.png" },
  { file: "squirrels-bar.png" },
  { file: "sureshot-taproom.png" },
  { file: "terrace-nq.png" },
  { file: "bay-horse-tavern.png" },
  { file: "gasworks-brew-bar.png" },
  { file: "the-goose.png" },
  { file: "junkyard-golf-club.png" },
  { file: "kings-arms-salford.png" },
  { file: "the-mancunian.png" },
  { file: "star-and-garter.png" },
  { file: "whiskey-jar.png" },
  { file: "track-brewing-co.png" },
  { file: "via-manchester.png" },
]

// ── Cold blue-grey tint over the LEFT ("a quiet tuesday") half ────────────────
function leftTintSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${HALF}" height="${H}" fill="${COOL}" fill-opacity="0.5"/>
  </svg>`)
}

// ── Amber→coral radial glow + light coral wash over the RIGHT half ────────────
function rightWarmSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="warm" cx="0.75" cy="0.52" r="0.55">
        <stop offset="0" stop-color="${AMBER}" stop-opacity="0.55"/>
        <stop offset="0.55" stop-color="${CORAL}" stop-opacity="0.28"/>
        <stop offset="1" stop-color="${CORAL}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="${HALF}" y="0" width="${HALF}" height="${H}" fill="url(#warm)"/>
    <rect x="${HALF}" y="0" width="${HALF}" height="${H}" fill="${CORAL}" fill-opacity="0.1"/>
  </svg>`)
}

// ── Bottom-up charcoal gradient (legibility) + slight top darken ──────────────
function gradientSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="btm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.4" stop-color="${CHARCOAL}" stop-opacity="0"/>
        <stop offset="0.78" stop-color="${CHARCOAL}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${CHARCOAL}" stop-opacity="0.92"/>
      </linearGradient>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${CHARCOAL}" stop-opacity="0.5"/>
        <stop offset="0.22" stop-color="${CHARCOAL}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#btm)"/>
    <rect width="${W}" height="${H}" fill="url(#top)"/>
  </svg>`)
}

// Deterministic RNG so the crowd is identical on every build.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// One simple coral figure (head + tapered body) at base point (cx, cy).
function figure(cx, cy, s, op) {
  const headR = 6.6 * s
  const headY = cy - 30 * s
  return `<g fill="${CORAL}" fill-opacity="${op.toFixed(2)}">
    <circle cx="${cx.toFixed(1)}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}"/>
    <path d="M ${(cx - 8 * s).toFixed(1)} ${cy.toFixed(1)}
             L ${(cx - 6.5 * s).toFixed(1)} ${(cy - 20 * s).toFixed(1)}
             Q ${cx.toFixed(1)} ${(cy - 25 * s).toFixed(1)} ${(cx + 6.5 * s).toFixed(1)} ${(cy - 20 * s).toFixed(1)}
             L ${(cx + 8 * s).toFixed(1)} ${cy.toFixed(1)} Z"/>
  </g>`
}

// The crowd: ~30 figures streaming in from the right edge toward the bar,
// larger in the foreground (near the edge), smaller receding into the room.
function crowdSvg() {
  const rng = mulberry32(20240426)
  const P0 = { x: 1178, y: 582 } // foreground, near right edge
  const P1 = { x: 752, y: 352 }  // toward the bar (recedes)
  const dx = P1.x - P0.x, dy = P1.y - P0.y
  const len = Math.hypot(dx, dy)
  const px = dy / len, py = -dx / len // perpendicular unit vector
  const N = 30
  const figs = []
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1)
    const jitterAmt = (1 - t) * 70 + 14
    const off = (rng() * 2 - 1) * jitterAmt
    const along = (rng() * 2 - 1) * 16
    const cx = P0.x + dx * t + px * off + (dx / len) * along
    const cy = P0.y + dy * t + py * off + (dy / len) * along
    const s = 1.08 - 0.8 * t
    const op = 0.92 - 0.46 * t
    figs.push({ cx, cy, s, op })
  }
  // Painter's order: smallest (furthest) first, largest (nearest) last.
  figs.sort((a, b) => a.s - b.s)
  const body = figs.map((f) => figure(f.cx, f.cy, f.s, f.op)).join("")
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`)
}

// Wordmark, pill, divider (coral + glow), before/after labels and the +100 motif.
function frameSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
    </defs>

    <!-- centre divider: faint coral glow either side + crisp 2px coral line -->
    <line x1="${HALF}" y1="36" x2="${HALF}" y2="${H - 36}" stroke="${CORAL}" stroke-opacity="0.4" stroke-width="10" filter="url(#soft)"/>
    <line x1="${HALF}" y1="36" x2="${HALF}" y2="${H - 36}" stroke="${CORAL}" stroke-width="2"/>

    <!-- wordmark top-left -->
    <text x="44" y="68" font-family="${FONT}" font-weight="800" font-size="34" fill="#FFFFFF" letter-spacing="-0.5">bamsip<tspan font-weight="500" fill="${CREAM}" font-size="22" dx="10">&#183; smarter nights out</tspan></text>

    <!-- "1 of 4" pill top-right -->
    <rect x="${W - 168}" y="34" width="128" height="42" rx="21" fill="${CORAL}"/>
    <text x="${W - 104}" y="62" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="20" fill="${CHARCOAL}">1 of 4</text>

    <!-- before/after labels -->
    <text x="44" y="${H - 44}" font-family="${FONT}" font-weight="600" font-size="26" fill="${CREAM}" fill-opacity="0.75" letter-spacing="0.5">a quiet tuesday</text>
    <text x="${HALF + 28}" y="${H - 44}" font-family="${FONT}" font-weight="800" font-size="26" fill="#FFFFFF" letter-spacing="0.5">with bamsip</text>

    <!-- +100 motif, beside the crowd -->
    <text x="${W - 44}" y="318" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="92" fill="${CORAL}">+100</text>
    <text x="${W - 46}" y="346" text-anchor="end" font-family="${FONT}" font-weight="600" font-size="20" fill="${CREAM}">first round, on us</text>
  </svg>`)
}

async function build({ file }) {
  const src = `${SRC}/${file}`
  const out = `${OUT}/${file}`
  const base = await sharp(src).resize(W, H, { fit: "cover" }).png().toBuffer()

  // Before/after split: left cold + dim (quiet), right warm + bright (alive).
  const left = await sharp(base)
    .extract({ left: 0, top: 0, width: HALF, height: H })
    .modulate({ brightness: 0.6, saturation: 0.3 })
    .png().toBuffer()
  const right = await sharp(base)
    .extract({ left: HALF, top: 0, width: HALF, height: H })
    .modulate({ brightness: 1.14, saturation: 1.28 })
    .png().toBuffer()

  let buf = await sharp({ create: { width: W, height: H, channels: 4, background: "#000" } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: HALF, top: 0 }])
    .png().toBuffer()

  buf = await sharp(buf).composite([{ input: leftTintSvg(), blend: "over" }]).png().toBuffer()
  buf = await sharp(buf).composite([{ input: rightWarmSvg(), blend: "soft-light" }]).png().toBuffer()
  buf = await sharp(buf).composite([{ input: rightWarmSvg(), blend: "over" }]).png().toBuffer()
  buf = await sharp(buf).composite([{ input: gradientSvg(), blend: "over" }]).png().toBuffer()
  buf = await sharp(buf).composite([{ input: crowdSvg(), blend: "over" }]).png().toBuffer()
  await sharp(buf).composite([{ input: frameSvg(), blend: "over" }]).png().toFile(out)
  console.log("[v0] built", out)
}

await mkdir(OUT, { recursive: true })
for (const v of VENUES) await build(v)
console.log("[v0] done")

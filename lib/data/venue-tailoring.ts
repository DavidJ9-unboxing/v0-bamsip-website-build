// ─────────────────────────────────────────────────────────────────────────────
// BamSip — per-venue tailoring for the PRIORITY (Tier A) outreach wave.
//
// Keyed by venue id. That id is the same number everywhere:
//   • `Orig #` on the "Prioritised" tab of BamSip_priority_venues.xlsx
//   • `#`      in venues_corrected.csv
//   • `id`     in venues-all.ts
//
// Each entry personalises ONE venue's launch-invite email. A venue that is NOT in
// this map falls back to the generic template — no hook line, default hero image —
// and the renderer collapses the empty {{hook}} line so there's never a gap.
//
// Voice: dry, British, a little cheeky, but still outreach to a busy GM — humour
// carries the charm, the offer carries the pitch. Most hooks wink at the bespoke
// hero image that sits directly above the greeting (see hero-image-prompts.md).
//
// This is the first, curated batch (26 of the ~86 Tier A venues). Same shape scales
// to the rest — add an entry and it personalises automatically.
// ─────────────────────────────────────────────────────────────────────────────

export interface VenueTailoring {
  /** Humorous opener. Sits on its own line right after "Hi {{venueName}},". */
  hook: string;
  /** Custom hero image path (generated in Claude Code; see hero-image-prompts.md).
   *  Lives under /public so Next serves it at this URL. */
  heroImage: string;
  /** Accessible alt text describing the hero image (plain description, no jokes). */
  heroAlt: string;
  /** OPTIONAL hard-override subject for this venue only. Leave unset to keep the
   *  venue in your global A/B subject test. */
  subject?: string;
}

export const TAILORED: Record<number, VenueTailoring> = {
  49: {
    hook: "A venue already serving pizza at 4am has basically been running our business plan for years — so the header up top is the least we could do, and a free first round for 100 people is the rest.",
    heroImage: "/images/venues/crazy-pedros.png",
    heroAlt: "A frosted margarita beside a single pizza slice on a dark, neon-lit bar.",
  }, // Crazy Pedro's
  48: {
    hook: "570 gins is a number that mostly inspires indecision, so we'll make one choice easy: the first round's on us. That's your wall of bottles up top, made specially.",
    heroImage: "/images/venues/atlas-bar.png",
    heroAlt: "A backlit wall of gin bottles under a brick railway arch, one garnished glass in focus.",
  }, // Atlas Bar
  81: {
    hook: "A restored Victorian market hall full of independents is the most Manchester thing we can picture — which is roughly why our designer enjoyed making the header above a little too much.",
    heroImage: "/images/venues/mackie-mayor.png",
    heroAlt: "A soaring restored market-hall interior with iron columns and warm hanging lights.",
  }, // Mackie Mayor
  37: {
    hook: "We thought about learning to yodel for this and decided a custom header was safer for everyone. A bier hall with cabaret already does 'big night' better than most — we'd just love to fill it.",
    heroImage: "/images/venues/alberts-schloss.png",
    heroAlt: "A festive Bavarian bier hall with long communal tables, steins and stage lights.",
  }, // Albert's Schloss
  476: {
    hook: "Any bar that lets the jukebox do the programming is speaking our language. The header's made specially, the rum's on you, the first round's on us.",
    heroImage: "/images/venues/mojo.png",
    heroAlt: "A moody rock-and-roll bar with a glowing vintage jukebox and rows of rum bottles.",
  }, // Mojo Manchester
  459: {
    hook: "A Village institution doing drag and cabaret till the small hours hardly needs us to find a crowd — but we'd love to send one anyway, first round paid, with a header made just for you up top.",
    heroImage: "/images/venues/new-york-new-york.png",
    heroAlt: "A glamorous cabaret stage with a spotlight and sequins catching warm light.",
  }, // New York New York
  65: {
    hook: "A whole railway depot to fill is a beautiful problem, and filling beautiful problems is rather our thing. The header above is our love letter to the place.",
    heroImage: "/images/venues/freight-island.png",
    heroAlt: "A vast industrial depot interior strung with festoon lights across steel rafters.",
  }, // Escape to Freight Island
  10: {
    hook: "A room that turns dinner into a circus by midnight is frankly showing off — so we made you a header that shows off back, and we'd love to pack it on a quieter night.",
    heroImage: "/images/venues/impossible.png",
    heroAlt: "A theatrical bar-club with a performer silhouette under dramatic stage lighting.",
  }, // Impossible Manchester
  281: {
    hook: "Natural wine, jazz and a view over the water is the sort of evening people write home about. The header up top is our attempt to bottle it — the actual wine we'll leave to you.",
    heroImage: "/images/venues/flawd.png",
    heroAlt: "A waterside wine bar at dusk with marina reflections and a glass of orange wine.",
  }, // Flawd
  300: {
    hook: "A place doing flat whites by day and pies-and-natural-wine by night has clearly thought about pacing, and so have we: one free round, then your bar, then everyone's very happy.",
    heroImage: "/images/venues/idle-hands.png",
    heroAlt: "A cosy bar with a golden house-made pie and a glass of wine on reclaimed wood.",
  }, // Idle Hands
  58: {
    hook: "A basement of ping pong and arcade machines is a dangerously good way to lose three hours — we'd love to send 100 people down to do exactly that, first round paid. No quarters required; that's your table up top.",
    heroImage: "/images/venues/twenty-twenty-two.png",
    heroAlt: "A neon-lit basement games bar with a ping-pong table mid-rally and arcade glow.",
  }, // Twenty Twenty Two
  426: {
    hook: "Crazy golf with five bars is the rare night where the round of golf and the round of drinks are equally likely to go sideways. We'd love to fill a course — and yes, that's your hole-in-one up top.",
    heroImage: "/images/venues/junkyard-golf.png",
    heroAlt: "A surreal blacklit mini-golf hole built from scrapyard sculpture with a neon flag.",
  }, // Junkyard Golf Club
  46: {
    hook: "A tiki bar hidden under the pavement is exactly where people fall in love at 11pm. The little paper umbrella in the header took an unreasonable amount of design discussion.",
    heroImage: "/images/venues/hula.png",
    heroAlt: "A lush subterranean tiki bar with carved idols and a flaming rum cocktail with a paper umbrella.",
  }, // Hula
  54: {
    hook: "350 whiskies in an old mill with bands in the basement — honestly, the header started as an excuse to draw that many bottles. We'd love to fill the room beneath them.",
    heroImage: "/images/venues/whiskey-jar.png",
    heroAlt: "A candle-lit whiskey bar in a brick mill with towering backlit bottle shelves and an amber glass.",
  }, // The Whiskey Jar
  439: {
    hook: "On the maps since 1844 is a longer run than most apps manage, so we approached the header with due reverence. We'd love to bring a fresh crowd to a proper Victorian boozer.",
    heroImage: "/images/venues/lass-o-gowrie.png",
    heroAlt: "An ornate Victorian tiled pub frontage at dusk with etched glass and warm light spilling out.",
  }, // Lass O'Gowrie
  291: {
    hook: "Daily karaoke is a brave and beautiful commitment and we respect it enormously. The header's up top, the songbook's yours, and we'll bring 100 people brave enough to use both.",
    heroImage: "/images/venues/the-millstone.png",
    heroAlt: "A warm pub interior with a karaoke microphone on a small stage under a single spotlight.",
  }, // The Millstone
  279: {
    hook: "Turning an old MOT garage into Detroit pizza and frozen cocktails is a glow-up we fully endorse — the header celebrates it, and we'd love to bring the crowd that fills the place.",
    heroImage: "/images/venues/ramona.png",
    heroAlt: "An industrial garage-turned-bar with roller-shutter doors, a square Detroit pizza slice and a slushy cocktail.",
  }, // Ramona
  420: {
    hook: "A Fallowfield bar with a terrace and a student crowd is, statistically, where our whole app wants to live. Header's up top — we'd love to send a launch night your way before term gets the memo.",
    heroImage: "/images/venues/nest.png",
    heroAlt: "A lively two-floor bar with a string-lit terrace at golden hour.",
  }, // Nest
  8: {
    hook: "Running nights on a site that's been at it since 1946 is a proper pedigree, and the VOID rig means the crowd will feel us arrive. Header made specially; sound system left exactly as you like it.",
    heroImage: "/images/venues/stage-and-radio.png",
    heroAlt: "A dark basement club with large speaker stacks and beams of light cutting through haze.",
  }, // Stage & Radio
  57: {
    hook: "Burgers, ribs and the game on the big screen is a near-perfect night that only improves with a free first round. The header up top is making us hungry, and we made it ourselves.",
    heroImage: "/images/venues/liquor-store.png",
    heroAlt: "An American-style bar and grill with a stacked burger, a frosty beer and soft neon glow.",
  }, // The Liquor Store
  66: {
    hook: "A waterside terrace in Castlefield on a warm evening rather sells itself, so we'll keep this short. The header above is our postcard — we'd love to fill the terrace with a launch night.",
    heroImage: "/images/venues/dukes-92.png",
    heroAlt: "A golden-hour canalside terrace in Castlefield with viaducts behind and glasses on the rail.",
  }, // Dukes 92
  244: {
    hook: "A beautifully restored Grade II gastropub deserves a beautifully made header, so we obliged. We'd love to bring a crowd to fill those handsome rooms on a quieter night.",
    heroImage: "/images/venues/black-friar.png",
    heroAlt: "An elegant restored gastropub interior with period details and soft pendant lighting.",
  }, // The Black Friar
  299: {
    hook: "A Sicilian bar and patisserie under one roof is a dangerous amount of temptation in one postcode. The header up top leans into it shamelessly — we'd love to send the crowd in.",
    heroImage: "/images/venues/sicilian-nq.png",
    heroAlt: "A warm Sicilian bar with a Negroni beside a tray of cannoli on Mediterranean tiles.",
  }, // Sicilian NQ
  438: {
    hook: "One of Manchester's biggest beer gardens right by the student village is almost unfair. Header's up top — we'd love to fill it while the weather's still pretending to cooperate.",
    heroImage: "/images/venues/courtyard.png",
    heroAlt: "A sprawling student beer garden at golden hour with long picnic benches and string lights.",
  }, // The Courtyard Manchester
  4: {
    hook: "A beloved bar with a cellar that's hosted half the DJs worth knowing is exactly our kind of room. The header up top is a small tribute — we'd love to bring a fresh crowd down the stairs.",
    heroImage: "/images/venues/joshua-brooks.png",
    heroAlt: "A dark basement club with a DJ booth silhouette and coral and violet lighting.",
  }, // Joshua Brooks
  77: {
    hook: "Being one of the bars that taught Manchester to care about craft beer is no small CV line, so we made the header with due respect. We'd love to point 100 thirsty people at those handpumps.",
    heroImage: "/images/venues/port-street.png",
    heroAlt: "A warm two-floor craft beer bar with a row of colourful tap handles and a hazy pale ale.",
  }, // Port Street Beer House
};

// ── Defaults for every non-tailored venue ────────────────────────────────────
export const DEFAULT_HERO = "/images/hero-night.png";
export const DEFAULT_HERO_ALT = "A warm, candle-lit Manchester cocktail bar at night.";

// ── Back-compat: the {{hook}} token still resolves from this map ──────────────
export const HOOKS: Record<number, string> = Object.fromEntries(
  Object.entries(TAILORED).map(([id, t]) => [Number(id), t.hook])
);

// ── Convenience resolver for the merge step (see the v0 prompt) ───────────────
export function resolveTailoring(id: number) {
  const t = TAILORED[id];
  return {
    hook: t?.hook ?? "",
    heroImage: t?.heroImage ?? DEFAULT_HERO,
    heroAlt: t?.heroAlt ?? DEFAULT_HERO_ALT,
    subject: t?.subject, // undefined => use the active A/B subject variant
    isTailored: Boolean(t),
  };
}

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
  hook?: string;
  /** Custom hero image path for this venue. Lives under /public so Next serves it
   *  at this URL (e.g. "/images/venues/joshua-brooks.png"). Leave unset to fall
   *  back to the default hero. */
  heroImage?: string;
  /** Accessible alt text describing the hero image (plain description, no jokes). */
  heroAlt?: string;
  /** OPTIONAL hard-override subject for this venue only. Leave unset to keep the
   *  venue in your global A/B subject test. */
  subject?: string;
}

// ── Per-venue custom heroes ───────────────────────────────────────────────────
// Add an entry keyed by venue id to give that venue its own hero image. Example:
//
//   4: {
//     heroImage: "/images/venues/joshua-brooks.png",
//     heroAlt: "A dark basement club with a DJ booth silhouette and warm lighting.",
//   }, // Joshua Brooks
//
// Any venue without an entry uses DEFAULT_HERO below.
export const TAILORED: Record<number, VenueTailoring> = {
  // Custom heroes removed — add per-venue entries here as you gather images.
};

// ── Defaults for every non-tailored venue ────────────────────────────────────
export const DEFAULT_HERO = "/images/hero-night.png";
export const DEFAULT_HERO_ALT = "A warm, candle-lit Manchester cocktail bar at night.";

// ── {{hook}} source of truth ──────────────────────────────────────────────────
// The unique opener line for every priority (Tier A) venue, keyed by venue id.
// This map SUPERSEDES the hooks on the TAILORED entries above (rewritten in the
// agreed voice and expanded from 26 to all 86). heroImage/heroAlt still come from
// TAILORED. An id missing here resolves to "" so the renderer collapses the line.
export const HOOKS: Record<number, string> = {
  4: "A cellar that's hosted half the DJs worth knowing shouldn't be sitting half-empty on a wet Tuesday. Filling the quiet ones is the whole job: you set the deal, we bring the crowd, and the numbers tell you which one did it.", // Joshua Brooks
  8: "You've been putting on nights since 1946, so we won't pretend to teach you about a busy room. The slow midweek slots are ours: set an offer, we fill the place, and the data shows what pulled them down to the basement.", // Stage & Radio
  10: "Turning dinner into a circus by midnight is a neat trick, but even circuses have quiet Tuesdays. That's where we come in: pick an offer, we bring the crowd, and you see exactly what filled the room.", // Impossible Manchester
  17: "A converted church running till the early hours is about as Fallowfield as it gets. We'll help with the nights even the students skip: set a deal, we send the crowd, and you only ever spend the discount you picked.", // 256 Wilmslow Road
  35: "Putting emerging bands on is a labour of love that doesn't always fill a Tuesday. We're the easy bit: run an offer on a quiet night, we bring the crowd, and the data tells you what worked.", // Jimmy's NQ
  37: "A bier hall with cabaret and a DJ clearly knows how to throw a big night. We're for the smaller ones: set an offer, we bring the crowd, and the figures show what filled the place midweek.", // Albert's Schloss
  46: "A tiki bar hidden under the pavement is exactly where people end up at 11pm. We'll help fill the earlier, quieter hours: you set the offer, we send the crowd, and the data shows what the rum punch pulled in.", // Hula
  48: "570 gins, and the hardest decision in the building is which one. The easy part is the quiet nights: you set an offer, we fill the room, and the data tells you whether it was the gin or the deal that did it.", // Atlas Bar
  49: "You've had the 4am crowd sorted for years, so the late slots aren't the problem. The quiet midweek hours are where we come in: pick an offer, we send the people, and you see exactly what the frozen margaritas pulled through the door.", // Crazy Pedro's
  54: "350 whiskies and a basement full of bands is a strong Friday. On a slow night we're your move: set an offer, we bring the crowd, and the data shows which one got them in.", // The Whiskey Jar
  57: "Burgers, ribs and the game on the big screen sell themselves at the weekend. Midweek is quieter, and quieter is our speciality: run an offer, we send a crowd, and you only spend the discount you chose.", // The Liquor Store
  58: "A basement of ping pong and arcade machines is rarely the problem on a Friday. The slow weeknights are: set a deal, we send a crowd to lose at beer pong, and you see which offer did the work.", // Twenty Twenty Two
  59: "A basement of cocktails, tapas and live music is a lovely thing on a busy night. On a quiet one we're the fix: you set the offer, we bring the crowd, and the data shows what filled the room.", // Sandinista
  60: "Five kitchens and a taproom under one roof is a serious operation to keep full. That's our whole pitch: pick a midweek offer, we send the crowd, and you see which kitchen and which deal pulled them in.", // Society Manchester
  63: "Karaoke and a Sunday carvery is a proper Canal Street combination. We'll help fill the quieter nights between: set an offer, we bring the crowd, and you only ever spend the discount you set.", // Bar Pop
  64: "A beautifully restored 1811 pub deserves a full room more than once a week. We're built for the rest of the week: run an offer on a quiet night, we send the crowd, and the data shows what worked.", // The Edinburgh Castle
  65: "A whole railway depot is a glorious thing to fill, and a daunting one on a Tuesday. We make it easy: set an offer, we bring the crowd, and the numbers tell you which bar and which deal did the pulling.", // Escape to Freight Island
  66: "A Castlefield terrace on a warm evening barely needs help. The grey midweek nights are another matter, and that's our bit: you set the offer, we fill the terrace, and you only spend the discount you chose.", // Dukes 92
  69: "A lock-keeper's cottage on the canal is a charming spot when the sun's out. We're for when it isn't: run an offer on a quiet night, we bring the crowd, and the data shows what filled it.", // Lock 91
  77: "You helped teach Manchester to care about cask, so we'll stay out of the cellar. The quiet afternoons are ours: set an offer, we send the drinkers, and you see exactly what each one poured.", // Port Street Beer House
  78: "A pub since 1776 with a gig room out back has clearly mastered the busy nights. We handle the quiet ones: run an offer, we bring the crowd, and the data tells you what got them through the door.", // The Castle Hotel
  81: "A Victorian market hall this handsome should have a crowd in it for more than the weekend lunch rush. That is our job: pick a midweek offer, we bring the people, and the only thing it costs you is the discount you chose.", // Mackie Mayor
  88: "One of the city's oldest queer venues, with drag and karaoke to match, doesn't lack for a Saturday crowd. We'll fill the quieter nights: set an offer, we bring the crowd, and you only ever spend the discount you set.", // New Union Hotel
  91: "You make the beer, so we won't tell you how to sell it. We will quietly fill the slow afternoons: set an offer, we send the drinkers, and you see what each one actually poured.", // Cloudwater Unit 9 Bar
  94: "A lively late-opening Thomas Street pub does fine on a Friday. Midweek is where we earn our keep: run an offer, we bring the crowd, and the data shows what pulled them in.", // The Bay Horse Tavern
  95: "Six rotating casks and a proper cosy boozer is a lovely thing on a busy night. On a slow one we're your move: we bring the drinkers, and it only ever costs you the discount you decided on.", // The Salisbury Ale House
  96: "A proper local showing the match daily is exactly the kind of honest boozer we like. We'll fill the gaps between fixtures: set an offer, we send a crowd, and you only spend the discount you chose.", // The Unicorn
  105: "A small-plates bar from the Electrik lot has good taste built in. We'll bring the numbers to match on a quiet night: you set the offer, we send the crowd, and the data shows what worked.", // Volta
  128: "Hundreds of wines, plus oysters and charcuterie, is a tough Tuesday to fill all the same. That's our department: run an offer, we bring the crowd, and you see exactly which night and which deal pulled them in.", // Wine and Wallop Didsbury
  228: "Wine flights and tastings make for a lovely independent on Northenden Road. We'll help fill the quiet evenings: set an offer, we send the crowd, and you only ever spend the discount you picked.", // Cork of the North Sale
  243: "A back-street boozer with a theatre upstairs is a proper Salford institution. On the dark nights we're the fix: run an offer, we bring the crowd, and the data shows what got them in.", // The Kings Arms Salford
  244: "A beautifully restored Grade II gastropub deserves a full room more than at the weekend. We're built for the rest of the week: set an offer, we bring the crowd, and you only spend the discount you chose.", // The Black Friar
  247: "A riverside pub by Salford Uni does fine when term's in full swing. We'll cover the quieter stretches: run an offer, we send a crowd, and the data shows what filled the terrace.", // Old Pint Pot
  275: "Your own beer at a shiny new development is a good start. We'll bring the footfall to fill it midweek: set an offer, we send the drinkers, and you see what each one poured.", // Seven Bro7hers Middlewood Locks
  277: "A microbrewery doing Sunday roasts out at MediaCity has range. We'll help fill the in-between nights: run an offer, we bring the crowd, and the data tells you which deal worked.", // 11 Central
  279: "Turning an old MOT garage into Detroit pizza and frozen cocktails is a glow-up we approve of. We'll bring the crowd on the quiet nights: set an offer, we send the people, and you see exactly what pulled them in.", // Ramona
  280: "Natural wine and seasonal small plates in Ancoats is a confident little room. We're for the quiet midweek covers: you set the offer, we bring the crowd, and the data shows what worked.", // Erst
  281: "Natural wine and jazz over the marina is a perfect Saturday. The quieter nights are where we earn it: put an offer up and we bring the crowd, no subscription, no risk on the bar.", // Flawd
  282: "A fully vegan cocktail bar on the marina is a genuinely fresh angle. We'll help fill the quiet nights: set an offer, we send the crowd, and you only ever spend the discount you chose.", // Finders Keepers
  283: "Your own brewery's beer in the Ice Plant is a strong pour. We'll bring the people on a slow night: run an offer, we send the drinkers, and you see exactly what each one shifted.", // Seven Bro7hers Beerhouse Ancoats
  284: "A wine bar where you can also do your gift shopping is a clever little Ancoats spot. We'll fill the quieter evenings: set an offer, we bring the crowd, and the data shows what worked.", // Blossom Street Social
  286: "A Parisian basement cocktail bar under Evelyn's is a lovely place to disappear on a Friday. We're for the slower nights: you set the offer, we send the crowd, and you only spend the discount you picked.", // The Daisy
  290: "Nightly bands on the old Dry Bar site is a fine bit of NQ history. We'll fill the quiet ones between gigs: run an offer, we bring the crowd, and the data shows what got them in.", // The Freemount
  291: "Daily karaoke is a brave and beautiful commitment. We'll bring the crowd to sing to on a slow night: set an offer, we send the people, and you only ever spend the discount you set.", // The Millstone
  292: "A Belgian beer bar with a garden out back is a connoisseur's corner. We're for the quiet nights: run an offer, we bring the drinkers, and you see exactly what each one poured.", // Bar Fringe
  293: "Another Pedro's, another late-night pizza-and-margarita operation that runs itself after dark. The quiet hours are ours: pick an offer, we send a crowd, and the data shows what pulled them in.", // Crazy Pedro's NQ
  294: "Rooftop terraces and wood-fired pizza are an easy sell when the sun's out. We're for when it isn't: set an offer, we bring the crowd, and you only spend the discount you chose.", // Terrace NQ
  299: "A Sicilian bar and patisserie under one roof is a dangerous amount of temptation in one postcode. We'll send the crowd on a quiet night: set an offer, we bring the people, and the data shows what worked.", // Sicilian NQ
  300: "Flat whites by day, pies and natural wine by night is good pacing. We'll fill the slow stretches: you set the offer, we send the crowd, and the data tells you which one pulled them in.", // Idle Hands
  302: "Thirty beer lines around a circular bar is a glorious problem to keep busy. That's our job: run an offer, we bring the drinkers, and you see exactly what each one poured.", // Head of Steam NQ
  303: "A diverse drinks list and live music on Oldham Street is a solid weekend. Midweek is ours: set an offer, we send the crowd, and you only ever spend the discount you chose.", // The Mancunian
  306: "Your own beer in a red-brick taproom needs no introduction. We'll bring the footfall on a quiet night: run an offer, we send the drinkers, and the data shows what worked.", // Northern Monk Refectory MCR
  307: "Fresh beer straight from the brewery next door is about as good as it gets. We'll fill the arch on a slow afternoon: set an offer, we send the drinkers, and you see exactly what each one poured.", // Sureshot Taproom
  308: "Twenty keg lines in 2,000 square feet is a lot of taproom to keep full. That's our pitch: run an offer, we bring the crowd, and the data tells you which beer and which deal pulled them in.", // Track Brewing Co Taproom
  314: "Brunch by day and bands on a Sunday is a full-spectrum operation. We'll fill the quiet bits between: set an offer, we send the crowd, and you only spend the discount you chose.", // Wallop Prestwich
  315: "A try-before-you-buy shop with a cocktail bar hidden upstairs is a lovely Prestwich secret. We'll bring people to find it: run an offer, we send the crowd, and the data shows what worked.", // Grape to Grain
  420: "A Fallowfield terrace full of students is the easy part of your calendar. We're built for the rest of it: run an app-only offer on a dead night and we'll fill it, free to you either way.", // Nest
  424: "A campus sports bar fills up whenever there's a match on. We'll cover the fixture-free nights: set an offer, we send the students, and you only ever spend the discount you set.", // Squirrels Bar
  426: "Five bars and a crazy golf course rarely struggle for a weekend crowd. Midweek is another story, and our story: set an offer, we send the players, and the data shows what filled the tee times.", // Junkyard Golf Club
  427: "A repurposed industrial space on First Street has room to spare on a quiet night. We'll help fill it: run an offer, we bring the crowd, and you see exactly what worked.", // The Gasworks Brew Bar
  430: "Sat between the universities and the hospital, you get every kind of crowd except a reliable midweek one. That's our bit: set an offer, we send the people, and the data shows what pulled them in.", // Turing Tap
  434: "Small-batch ales and Asian street food at Circle Square is a smart combination. We'll bring the crowd on a slow night: run an offer, we send the drinkers, and you see what each one poured.", // North Taproom
  435: "Five kitchens and a terrace is a lot of First Street to fill midweek. That's our job: set an offer, we send the crowd, and the data tells you which kitchen and which deal did it.", // House of Social
  438: "One of Manchester's biggest beer gardens by the Student Village is almost unfair when term's on. We'll fill the quiet stretches: run an offer, we bring the crowd, and you only spend the discount you chose.", // The Courtyard Manchester
  439: "On the maps since 1844, which means you've outlasted every nightlife fad going. The one thing even you can't dodge is a slow midweek, so that's the bit we fill: your deal, our crowd, and the data to prove it landed.", // Lass O'Gowrie
  443: "A proper alternative venue with a basement club is a Friday-night institution. We'll handle the quiet ones: set an offer, we bring the crowd, and the data shows what got them downstairs.", // Retro Bar
  444: "A pub with a purpose-built stage and a yard does well on a gig night. We're for the rest of the week: run an offer, we send the crowd, and you only ever spend the discount you set.", // Grafton Arms
  445: "Brewing your own beer next to Indian street food is a genuinely brilliant idea. We'll bring the crowd on a quiet night: set an offer, we send the people, and the data shows what pulled them in.", // Bundobust Brewery
  446: "A three-floor pub in an old umbrella factory with one of the city's biggest gardens is a lot to fill when it rains. Fittingly, that's our bit: run an offer, we bring the crowd, and you only spend the discount you chose.", // Rain Bar
  447: "A relaxed bar-meets-restaurant near Oxford Road station does steady weekend trade. Midweek is ours: set an offer, we send the crowd, and the data tells you what worked.", // Brickhouse Social
  450: "An all-day spot on University Green sees plenty of daytime trade. We'll fill the quieter evenings: run an offer, we send the students, and you only ever spend the discount you set.", // Navarro Lounge
  452: "Cabaret, drag and DJs across multiple floors since 1995 is a serious Canal Street pedigree. We'll fill the quieter nights: set an offer, we bring the crowd, and the data shows what worked.", // Via Manchester
  454: "A members' basement bar with a devoted following knows exactly who it's for. We'll help fill the quieter nights: set an offer, we bring the right crowd, and you only ever spend the discount you chose.", // The Eagle Manchester
  455: "Quiz, karaoke and drag cabaret over real ale is a proper Village all-rounder. We'll fill the nights in between: run an offer, we send the crowd, and you only spend the discount you set.", // The Goose
  459: "The drag and cabaret pack out your weekend, so we won't insult you there. The quiet Mondays are the ones we'd fill, with an offer you set and a crowd we bring.", // New York New York
  461: "A big multi-floor party bar on the Locks lives for the weekend. Midweek is where we help: set an offer, we send the crowd, and the data tells you which deal pulled them in.", // Revolution Deansgate Locks
  469: "Live blues and bourbon every single night is a real commitment to the cause. We'll bring the crowd to hear it on a quiet one: run an offer, we send the people, and you only ever spend the discount you set.", // The Blues Kitchen Manchester
  471: "Bottomless brunch and a riverside terrace is a reliable weekend earner. Midweek is ours: set an offer, we send the crowd, and the data shows what worked.", // Slug & Lettuce Spinningfields
  472: "A glass-canopied terrace over the Castlefield water is a lovely place to be on a sunny day. We're for the rest of the calendar: run an offer, we bring the crowd, and you only spend the discount you chose.", // Albert's Shed
  474: "Leather sofas and chandeliers make for a cosy Castlefield hideaway. We'll bring the crowd on a quiet night: set an offer, we send the people, and the data tells you what worked.", // The Banyan Tree
  476: "A bar where the jukebox does the programming is speaking our language. We'll fill the quiet nights: you set the offer, we bring the crowd, and the data shows what got them in.", // Mojo Manchester
  477: "Rum, Latin music and a Cuban theme is a guaranteed good Saturday. We'll fill the quieter nights: run an offer, we send the crowd, and you only ever spend the discount you set.", // Revolucion de Cuba Manchester
  479: "A big bar on St Peter's Square does steady after-work trade. We'll help with the slower nights: set an offer, we send the crowd, and the data shows what pulled them in.", // The Anthologist
  482: "A taproom right by the station catches plenty of passing trade. We'll fill the quiet hours: run an offer, we send the drinkers, and you see exactly what each one poured.", // Piccadilly Tap
  486: "A grassroots music venue in a Grade II pub is exactly the kind of place we love to see full. We'll help on the quiet nights: set an offer, we bring the crowd, and the data shows what got them in.", // The Star and Garter
  488: "Twice LocAle Pub of the Year is no small badge for an Urmston taphouse. We'll bring the footfall to match on a quiet night: run an offer, we send the drinkers, and you only ever spend the discount you set.", // The Prairie Schooner Taphouse
};

// ── Convenience resolver for the merge step (see the v0 prompt) ───────────────
// Hooks come from HOOKS (single source of truth, all 86 Tier A venues); hero and
// optional subject overrides still come from TAILORED. A venue is "tailored" if
// it has either a hook or a TAILORED entry.
export function resolveTailoring(id: number) {
  const t = TAILORED[id];
  const hook = HOOKS[id] ?? "";
  return {
    hook,
    heroImage: t?.heroImage ?? DEFAULT_HERO,
    heroAlt: t?.heroAlt ?? DEFAULT_HERO_ALT,
    subject: t?.subject, // undefined => use the active A/B subject variant
    isTailored: Boolean(hook) || Boolean(t),
  };
}

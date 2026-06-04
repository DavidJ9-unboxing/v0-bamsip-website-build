// Deterministic mock data for the interactive app demo.
// No random values — keeps the demo stable across renders.

export type Vibe = "Chill" | "Party" | "Live" | "Food" | "Deals"

export interface DemoVenue {
  id: string
  name: string
  area: string
  vibe: Vibe
  distance: string
  rating: number
  status: string
  statusTone: "live" | "warm" | "calm"
  pin: { x: number; y: number }
  offer: {
    title: string
    detail: string
    each: number
    was: number
  }
}

export const DEMO_VENUES: DemoVenue[] = [
  {
    id: "salford-distillery",
    name: "The Salford Distillery",
    area: "Salford",
    vibe: "Deals",
    distance: "0.4 mi",
    rating: 4.8,
    status: "2-4-1 cocktails live",
    statusTone: "live",
    pin: { x: 30, y: 38 },
    offer: {
      title: "2 cocktails",
      detail: "house cocktails, any two",
      each: 6,
      was: 11,
    },
  },
  {
    id: "the-refuge",
    name: "The Refuge",
    area: "City Centre",
    vibe: "Chill",
    distance: "0.6 mi",
    rating: 4.7,
    status: "quiet til 9",
    statusTone: "calm",
    pin: { x: 55, y: 30 },
    offer: {
      title: "2 negronis",
      detail: "stirred, not stressed",
      each: 7,
      was: 12,
    },
  },
  {
    id: "hidden",
    name: "Hidden",
    area: "Downtex",
    vibe: "Party",
    distance: "1.1 mi",
    rating: 4.6,
    status: "filling fast",
    statusTone: "warm",
    pin: { x: 22, y: 64 },
    offer: {
      title: "4 tinnies",
      detail: "ice cold, pre-paid",
      each: 4,
      was: 6,
    },
  },
  {
    id: "factory-251",
    name: "Factory 251",
    area: "Princess St",
    vibe: "Live",
    distance: "0.9 mi",
    rating: 4.5,
    status: "live set 11pm",
    statusTone: "warm",
    pin: { x: 68, y: 58 },
    offer: {
      title: "2 spirit + mixer",
      detail: "house spirits",
      each: 5,
      was: 9,
    },
  },
  {
    id: "northern-quarter",
    name: "NQ Tap House",
    area: "Northern Quarter",
    vibe: "Food",
    distance: "0.3 mi",
    rating: 4.9,
    status: "kitchen til late",
    statusTone: "calm",
    pin: { x: 78, y: 40 },
    offer: {
      title: "pint + small plate",
      detail: "craft + kitchen",
      each: 9,
      was: 14,
    },
  },
  {
    id: "ancoats",
    name: "Ancoats General Store",
    area: "Ancoats",
    vibe: "Chill",
    distance: "0.8 mi",
    rating: 4.7,
    status: "happy hour 6-8",
    statusTone: "live",
    pin: { x: 45, y: 70 },
    offer: {
      title: "2 spritz",
      detail: "aperol or limoncello",
      each: 6,
      was: 10,
    },
  },
]

export const VIBES: Vibe[] = ["Chill", "Party", "Live", "Food", "Deals"]

export interface DemoEvent {
  id: string
  title: string
  venue: string
  area: string
  day: string
  date: string
  time: string
  tag: string
  tagTone: "live" | "warm" | "calm"
  spotsLeft: number
  spotsTotal: number
  price: number
  was: number
  perk: string
  blurb: string
  lineup: string[]
}

export const DEMO_EVENTS: DemoEvent[] = [
  {
    id: "nq-live-sessions",
    title: "Northern Quarter Live Sessions",
    venue: "NQ Tap House",
    area: "Northern Quarter",
    day: "Fri",
    date: "12 Jul",
    time: "8pm – late",
    tag: "filling fast",
    tagTone: "warm",
    spotsLeft: 18,
    spotsTotal: 120,
    price: 8,
    was: 14,
    perk: "first drink + live set",
    blurb: "Three local bands, one room, and a welcome cocktail waiting on arrival.",
    lineup: ["The Tin Roses", "Velour", "DJ Marra til 2"],
  },
  {
    id: "cocktail-masterclass",
    title: "Cocktail Masterclass & Late",
    venue: "The Refuge",
    area: "City Centre",
    day: "Sat",
    date: "13 Jul",
    time: "7pm – 11pm",
    tag: "going quick",
    tagTone: "live",
    spotsLeft: 6,
    spotsTotal: 40,
    price: 22,
    was: 35,
    perk: "make 3, drink 3",
    blurb: "Shake three signature serves with the head bartender, then stay for the late session.",
    lineup: ["Negroni clinic", "Espresso martini battle", "DJ til midnight"],
  },
  {
    id: "student-takeover",
    title: "Student Takeover Thursdays",
    venue: "Factory 251",
    area: "Princess St",
    day: "Thu",
    date: "18 Jul",
    time: "9pm – 3am",
    tag: "weekly",
    tagTone: "calm",
    spotsLeft: 240,
    spotsTotal: 600,
    price: 5,
    was: 10,
    perk: "£2 tinnies all night",
    blurb: "The big midweek one. Pre-paid entry, capped drinks prices, three rooms of sound.",
    lineup: ["Room 1: house", "Room 2: throwbacks", "Room 3: garage"],
  },
  {
    id: "rooftop-spritz",
    title: "Rooftop Spritz Social",
    venue: "Ancoats General Store",
    area: "Ancoats",
    day: "Sun",
    date: "21 Jul",
    time: "2pm – 8pm",
    tag: "new",
    tagTone: "warm",
    spotsLeft: 52,
    spotsTotal: 90,
    price: 12,
    was: 18,
    perk: "2 spritz + small plate",
    blurb: "Lazy Sunday on the roof — aperol, limoncello and a kitchen plate to share.",
    lineup: ["Acoustic afternoon", "Sunset DJ set"],
  },
]

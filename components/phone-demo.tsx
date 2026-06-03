"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Map as MapIcon,
  Wallet as WalletIcon,
  User,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Minus,
  Plus,
  Zap,
  Users,
  Clock,
  TrendingUp,
  Check,
  Wifi,
} from "lucide-react"
import { PhoneFrame } from "./phone-frame"
import { DEMO_VENUES, VIBES, type DemoVenue, type Vibe } from "@/lib/demo-data"

type Screen = "home" | "map" | "venue" | "prebuy" | "wallet" | "redeem" | "profile"

const screenTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { type: "spring" as const, stiffness: 320, damping: 30 },
}

const toneStyles: Record<DemoVenue["statusTone"], string> = {
  live: "bg-amber/15 text-amber",
  warm: "bg-flame/15 text-flame",
  calm: "bg-success/15 text-success",
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[10px] font-medium text-cream">
      <span>23:14</span>
      <span className="flex items-center gap-1">
        <Wifi className="h-3 w-3" />
      </span>
    </div>
  )
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col">{children}</div>
}

export function PhoneDemo({ float = false }: { float?: boolean }) {
  const [screen, setScreen] = useState<Screen>("home")
  const [venue, setVenue] = useState<DemoVenue>(DEMO_VENUES[0])
  const [qty, setQty] = useState(2)
  const [activeVibe, setActiveVibe] = useState<Vibe | null>(null)
  const [locked, setLocked] = useState(false)
  const [redeemed, setRedeemed] = useState(false)

  const tab: Screen =
    screen === "venue" || screen === "prebuy" ? "home" : screen === "redeem" ? "wallet" : screen

  const openVenue = (v: DemoVenue) => {
    setVenue(v)
    setQty(2)
    setScreen("venue")
  }

  const lockIn = () => {
    setLocked(true)
    setRedeemed(false)
    setScreen("wallet")
  }

  const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "map", label: "Map", icon: MapIcon },
    { id: "wallet", label: "Wallet", icon: WalletIcon },
    { id: "profile", label: "Profile", icon: User },
  ]

  const filteredVenues = activeVibe
    ? DEMO_VENUES.filter((v) => v.vibe === activeVibe)
    : DEMO_VENUES

  return (
    <motion.div
      animate={float ? { y: [0, -12, 0] } : undefined}
      transition={
        float
          ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <PhoneFrame>
        <ScreenShell>
          <StatusBar />

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* HOME */}
              {screen === "home" && (
                <motion.div
                  key="home"
                  {...screenTransition}
                  className="absolute inset-0 overflow-y-auto px-4 pb-4"
                >
                  <p className="mt-2 text-[11px] uppercase tracking-wider text-mute">
                    Tonight in Manchester
                  </p>
                  <h2 className="font-display text-2xl font-bold lowercase text-cream">
                    smarter nights out.
                  </h2>

                  <button
                    onClick={() => openVenue(DEMO_VENUES[0])}
                    className="mt-4 w-full rounded-2xl border border-flame/30 bg-gradient-to-br from-flame/20 to-ink2 p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-flame px-2 py-0.5 text-[10px] font-semibold text-cream">
                        SAVE TONIGHT
                      </span>
                      <ChevronRight className="h-4 w-4 text-flame" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-cream">
                      2 cocktails · The Salford Distillery
                    </p>
                    <p className="text-xs text-cream2">
                      £6 each{" "}
                      <span className="text-mute line-through">£11</span> · ends
                      11:30
                    </p>
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <HomeTile icon={Users} label="Plan with Friends" tone="violet" />
                    <HomeTile icon={Clock} label="Early Bird" tone="amber" />
                  </div>

                  <button
                    onClick={() => setScreen("map")}
                    className="mt-3 flex w-full items-center justify-between rounded-2xl border border-hairline bg-ink2 p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber" />
                      <span className="text-sm font-medium text-cream">
                        Tonight&apos;s Offers
                      </span>
                    </div>
                    <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-amber">
                      14 live
                    </span>
                  </button>

                  <p className="mt-4 mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-mute">
                    <TrendingUp className="h-3 w-3" /> Trending near you
                  </p>
                  <div className="space-y-2">
                    {DEMO_VENUES.slice(1, 4).map((v) => (
                      <VenueRow key={v.id} venue={v} onClick={() => openVenue(v)} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* MAP */}
              {screen === "map" && (
                <motion.div
                  key="map"
                  {...screenTransition}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="px-4 pt-2">
                    <h2 className="font-display text-lg font-bold text-cream">
                      Map
                    </h2>
                    <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {VIBES.map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() =>
                            setActiveVibe((cur) => (cur === vibe ? null : vibe))
                          }
                          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                            activeVibe === vibe
                              ? "bg-flame text-cream"
                              : "bg-ink2 text-cream2"
                          }`}
                        >
                          {vibe}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-2 flex-1 overflow-hidden">
                    <AbstractMap
                      venues={filteredVenues}
                      onPin={(v) => openVenue(v)}
                    />
                  </div>
                </motion.div>
              )}

              {/* VENUE */}
              {screen === "venue" && (
                <motion.div
                  key="venue"
                  {...screenTransition}
                  className="absolute inset-0 overflow-y-auto"
                >
                  <div className="relative h-32 bg-gradient-to-br from-flame/40 via-violet/30 to-ink2">
                    <button
                      onClick={() => setScreen("map")}
                      className="absolute left-3 top-3 rounded-full bg-ink/60 p-1.5 backdrop-blur"
                      aria-label="Back"
                    >
                      <ChevronLeft className="h-4 w-4 text-cream" />
                    </button>
                  </div>
                  <div className="px-4 pb-4">
                    <h2 className="mt-3 font-display text-xl font-bold text-cream">
                      {venue.name}
                    </h2>
                    <p className="flex items-center gap-2 text-xs text-cream2">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber text-amber" />
                        {venue.rating}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" /> {venue.area} · {venue.distance}
                      </span>
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${toneStyles[venue.statusTone]}`}
                    >
                      {venue.status}
                    </span>

                    <div className="mt-4 rounded-2xl border border-flame/30 bg-ink2 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-flame">
                        Flash deal
                      </p>
                      <p className="mt-1 text-base font-semibold text-cream">
                        {venue.offer.title}
                      </p>
                      <p className="text-xs text-cream2">{venue.offer.detail}</p>
                      <p className="mt-2 text-sm text-cream">
                        £{venue.offer.each} each{" "}
                        <span className="text-mute line-through">
                          £{venue.offer.was}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => setScreen("prebuy")}
                      className="mt-4 w-full rounded-xl bg-flame py-3 text-sm font-semibold text-cream"
                    >
                      pre-buy this deal
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PRE-BUY */}
              {screen === "prebuy" && (
                <motion.div
                  key="prebuy"
                  {...screenTransition}
                  className="absolute inset-0 flex flex-col px-4"
                >
                  <button
                    onClick={() => setScreen("venue")}
                    className="mt-2 flex items-center gap-1 text-xs text-mute"
                  >
                    <ChevronLeft className="h-4 w-4" /> back
                  </button>
                  <h2 className="mt-2 font-display text-lg font-bold text-cream">
                    Pre-buy
                  </h2>
                  <div className="mt-3 rounded-2xl border border-hairline bg-ink2 p-4">
                    <p className="text-sm font-semibold text-cream">
                      {venue.offer.title} at {venue.name}
                    </p>
                    <p className="text-xs text-cream2">{venue.offer.detail}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-mute">quantity</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="rounded-full bg-ink3 p-1.5"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5 text-cream" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-cream">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty((q) => Math.min(6, q + 1))}
                          className="rounded-full bg-flame p-1.5"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5 text-cream" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
                      <span className="text-sm text-cream2">total</span>
                      <span className="font-display text-lg font-bold text-cream">
                        £{(venue.offer.each * qty).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-right text-[11px] text-success">
                      you save £{((venue.offer.was - venue.offer.each) * qty).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={lockIn}
                    className="mt-auto mb-4 w-full rounded-xl bg-flame py-3 text-sm font-semibold text-cream"
                  >
                    lock it in
                  </button>
                </motion.div>
              )}

              {/* WALLET */}
              {screen === "wallet" && (
                <motion.div
                  key="wallet"
                  {...screenTransition}
                  className="absolute inset-0 overflow-y-auto px-4"
                >
                  <h2 className="mt-2 font-display text-lg font-bold text-cream">
                    Wallet
                  </h2>
                  <div className="mt-2 flex gap-1.5 text-[11px]">
                    {["Offers", "Pre-buys", "Tickets", "Rewards"].map((t, i) => (
                      <span
                        key={t}
                        className={`rounded-full px-2.5 py-1 font-medium ${
                          i === 1 ? "bg-flame text-cream" : "bg-ink2 text-mute"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {locked ? (
                    <button
                      onClick={() => {
                        setRedeemed(false)
                        setScreen("redeem")
                      }}
                      className="mt-4 w-full overflow-hidden rounded-2xl border border-flame/40 bg-ink2 text-left"
                    >
                      <div className="bg-gradient-to-r from-flame/25 to-violet/20 px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-flame">
                          Ready to redeem
                        </p>
                        <p className="text-sm font-semibold text-cream">
                          {qty}× {venue.offer.title}
                        </p>
                        <p className="text-xs text-cream2">{venue.name}</p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-xs text-mute">tap to redeem at the bar</span>
                        <ChevronRight className="h-4 w-4 text-flame" />
                      </div>
                    </button>
                  ) : (
                    <div className="mt-10 text-center">
                      <WalletIcon className="mx-auto h-8 w-8 text-mute" />
                      <p className="mt-2 text-sm text-mute">
                        no pre-buys yet
                      </p>
                      <button
                        onClick={() => setScreen("map")}
                        className="mt-3 rounded-full bg-flame px-4 py-1.5 text-xs font-semibold text-cream"
                      >
                        find a deal
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* REDEEM */}
              {screen === "redeem" && (
                <motion.div
                  key="redeem"
                  {...screenTransition}
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                >
                  {!redeemed ? (
                    <>
                      <div className="relative flex h-40 w-40 items-center justify-center">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="absolute rounded-full border border-flame/50"
                            initial={{ width: 64, height: 64, opacity: 0.6 }}
                            animate={{
                              width: 160,
                              height: 160,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.6,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-flame">
                          <Wifi className="h-7 w-7 text-cream" />
                        </div>
                      </div>
                      <h3 className="mt-6 font-display text-xl font-bold lowercase text-cream">
                        tap to redeem
                      </h3>
                      <p className="mt-1 text-xs text-cream2">
                        hold near the BamSip reader at the bar
                      </p>
                      <button
                        onClick={() => setRedeemed(true)}
                        className="mt-6 rounded-full bg-flame px-6 py-2.5 text-sm font-semibold text-cream"
                      >
                        simulate tap
                      </button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success">
                        <Check className="h-8 w-8 text-ink" />
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-bold lowercase text-cream">
                        sorted.
                      </h3>
                      <p className="mt-1 text-sm text-cream2">show the bar.</p>
                      <button
                        onClick={() => {
                          setLocked(false)
                          setRedeemed(false)
                          setScreen("home")
                        }}
                        className="mt-6 rounded-full bg-ink2 px-5 py-2 text-xs font-medium text-cream2"
                      >
                        start over
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* PROFILE */}
              {screen === "profile" && (
                <motion.div
                  key="profile"
                  {...screenTransition}
                  className="absolute inset-0 px-4"
                >
                  <h2 className="mt-2 font-display text-lg font-bold text-cream">
                    Profile
                  </h2>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-hairline bg-ink2 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flame/20 font-display font-bold text-flame">
                      JB
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cream">Jordan B.</p>
                      <p className="text-xs text-mute">Bammer since 2026</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Stat label="saved" value="£128" />
                    <Stat label="nights out" value="23" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <nav className="flex items-center justify-around border-t border-hairline bg-ink/80 px-2 pb-4 pt-2 backdrop-blur">
            {navItems.map((item) => {
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1"
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon
                    className={`h-5 w-5 ${active ? "text-flame" : "text-mute"}`}
                  />
                  <span
                    className={`text-[9px] ${active ? "text-flame" : "text-mute"}`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </ScreenShell>
      </PhoneFrame>
    </motion.div>
  )
}

function HomeTile({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof Home
  label: string
  tone: "violet" | "amber"
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet/30 text-violet"
      : "border-amber/30 text-amber"
  return (
    <div className={`rounded-2xl border bg-ink2 p-3 ${toneClass}`}>
      <Icon className="h-4 w-4" />
      <p className="mt-2 text-xs font-medium text-cream">{label}</p>
    </div>
  )
}

function VenueRow({
  venue,
  onClick,
}: {
  venue: DemoVenue
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-hairline bg-ink2 p-3 text-left"
    >
      <div>
        <p className="text-sm font-medium text-cream">{venue.name}</p>
        <p className="text-[11px] text-mute">
          {venue.area} · {venue.distance}
        </p>
      </div>
      <span
        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${toneStyles[venue.statusTone]}`}
      >
        {venue.status}
      </span>
    </button>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-ink2 p-4 text-center">
      <p className="font-display text-xl font-bold text-cream">{value}</p>
      <p className="text-[11px] text-mute">{label}</p>
    </div>
  )
}

function AbstractMap({
  venues,
  onPin,
}: {
  venues: DemoVenue[]
  onPin: (v: DemoVenue) => void
}) {
  return (
    <div className="absolute inset-0 bg-[#0d0d14]">
      {/* Abstract street grid */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="mapglow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#FF6B54" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d0d14" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#mapglow)" />
        {[18, 38, 58, 78].map((y) => (
          <line
            key={`h${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y + 6}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}
        {[20, 45, 70].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            y1="0"
            x2={x + 8}
            y2="100"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}
        {/* River Irwell suggestion */}
        <path
          d="M0 70 Q 30 55 50 72 T 100 60"
          stroke="rgba(124,58,237,0.25)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Pins */}
      {venues.map((v) => (
        <button
          key={v.id}
          onClick={() => onPin(v)}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${v.pin.x}%`, top: `${v.pin.y}%` }}
          aria-label={`${v.name}, ${v.status}`}
        >
          <span className="relative flex flex-col items-center">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink ${
                v.statusTone === "live"
                  ? "bg-amber"
                  : v.statusTone === "warm"
                    ? "bg-flame"
                    : "bg-success"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-ink" />
            </span>
            <span className="mt-0.5 max-w-[64px] truncate rounded bg-ink/80 px-1 text-[8px] text-cream backdrop-blur">
              {v.name}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

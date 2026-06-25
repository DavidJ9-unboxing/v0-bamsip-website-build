"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  sendVenueCampaign,
  sendVenueTest,
  renderVenuePreview,
  type EmailableVenue,
  type VenueOverride,
} from "@/app/actions/venue-email"
import {
  VENUE_LAUNCH_HERO,
  VENUE_LAUNCH_SUBJECT,
  VENUE_LAUNCH_SUBJECTS,
  defaultVenueLaunchContent,
  type VenueEmailContent,
} from "@/lib/email-templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Send,
  Mail,
  Code,
  Eye,
  AlertTriangle,
  Users,
  CheckCircle2,
  Store,
  BookMarked,
  Clock,
  Ban,
  Check,
  Sparkles,
  Pencil,
} from "lucide-react"

type Mode = "template" | "html"

export function VenueEmailComposer({
  venues,
  emailConfigured,
  defaultCtaUrl,
  adminEmail,
}: {
  venues: EmailableVenue[]
  emailConfigured: boolean
  defaultCtaUrl: string
  adminEmail: string
}) {
  const router = useRouter()
  const [isSending, startSending] = useTransition()
  // Relative timestamps depend on the browser's clock/locale, so only render
  // them after mount to avoid an SSR/client hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // ---- recipients ----
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState<"all" | "directory" | "signup">("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Optimistic send-tracking overlay so per-row "Sent" pills update instantly
  // after a send, before the server refresh lands.
  const [sentOverlay, setSentOverlay] = useState<
    Record<string, { timesSent: number; lastSentAt: string | null }>
  >({})

  const venuesView = useMemo(
    () =>
      venues.map((v) => {
        const o = sentOverlay[v.key]
        return o ? { ...v, timesSent: o.timesSent, lastSentAt: o.lastSentAt } : v
      }),
    [venues, sentOverlay],
  )

  const statuses = useMemo(
    () => Array.from(new Set(venues.map((v) => v.status))).sort(),
    [venues],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return venuesView.filter((v) => {
      if (sourceFilter !== "all" && v.source !== sourceFilter) return false
      if (statusFilter === "sent" && v.timesSent === 0) return false
      else if (statusFilter === "not-sent" && v.timesSent > 0) return false
      else if (statusFilter !== "all" && statusFilter !== "sent" && statusFilter !== "not-sent" && v.status !== statusFilter)
        return false
      if (!q) return true
      return (
        v.venueName.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.contactName.toLowerCase().includes(q)
      )
    })
  }, [venuesView, search, sourceFilter, statusFilter])

  // Only emailable rows can be (de)selected — non-emailable are excluded from bulk.
  const selectableFiltered = useMemo(
    () => filtered.filter((v) => v.emailable),
    [filtered],
  )

  const allFilteredSelected =
    selectableFiltered.length > 0 &&
    selectableFiltered.every((v) => selected.has(v.key))

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const toggleAllFiltered = () =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (allFilteredSelected) selectableFiltered.forEach((v) => next.delete(v.key))
      else selectableFiltered.forEach((v) => next.add(v.key))
      return next
    })

  // record an optimistic successful send for one venue
  const markSent = (v: EmailableVenue) =>
    setSentOverlay((prev) => ({
      ...prev,
      [v.key]: {
        timesSent: (prev[v.key]?.timesSent ?? v.timesSent) + 1,
        lastSentAt: new Date().toISOString(),
      },
    }))

  // ---- compose ----
  const defaultContent = defaultVenueLaunchContent(defaultCtaUrl)
  const [mode, setMode] = useState<Mode>("template")
  const [subject, setSubject] = useState<string>(VENUE_LAUNCH_SUBJECT)
  const initial = defaultContent.mode === "template" ? defaultContent : null
  const [heroUrl, setHeroUrl] = useState(initial?.heroUrl ?? VENUE_LAUNCH_HERO)
  const [headline, setHeadline] = useState(initial?.headline ?? "")
  const [body, setBody] = useState(initial?.body ?? "")
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel ?? "")
  const [ctaUrl, setCtaUrl] = useState(initial?.ctaUrl ?? defaultCtaUrl)
  const [rawHtml, setRawHtml] = useState("")

  const buildContent = (): VenueEmailContent =>
    mode === "html"
      ? { mode: "html", rawHtml }
      : { mode: "template", heroUrl, headline, body, ctaLabel, ctaUrl }

  // ---- per-venue overrides (keyed by venue.key) ----
  // An override fully supersedes the master template for that one venue.
  const [overrides, setOverrides] = useState<Record<string, VenueOverride>>({})

  const setOverride = (key: string, patch: Partial<VenueOverride> | null) =>
    setOverrides((prev) => {
      if (patch === null) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: { ...prev[key], ...patch } }
    })

  // ---- preview ----
  const [previewOpen, setPreviewOpen] = useState(false)
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null)
  const [previewing, startPreview] = useTransition()
  // Which venue the live preview/test personalizes to. Defaults to the first
  // selected recipient, but you can preview as any venue.
  const [previewKey, setPreviewKey] = useState<string>("")

  // Venue the preview personalizes to: the explicitly chosen one, else the
  // first selected recipient, else the first venue in the list.
  const previewVenue = useMemo(() => {
    if (previewKey) {
      const byKey = venues.find((v) => v.key === previewKey)
      if (byKey) return byKey
    }
    return venues.find((v) => selected.has(v.key)) ?? venues[0]
  }, [venues, selected, previewKey])

  // Options for the "Preview as" picker: selected recipients first, then the
  // rest of the list. Capped so the dropdown stays light with 500+ venues.
  const previewOptions = useMemo(() => {
    const chosen = venues.filter((v) => selected.has(v.key))
    const rest = venues.filter((v) => !selected.has(v.key))
    const merged = [...chosen, ...rest].slice(0, 200)
    // Always keep the currently-previewed venue available as an option.
    if (previewVenue && !merged.some((v) => v.key === previewVenue.key)) {
      merged.unshift(previewVenue)
    }
    return merged
  }, [venues, selected, previewVenue])

  // Manual override for the venue currently being previewed (if any).
  const currentOverride = previewVenue ? overrides[previewVenue.key] : undefined

  // Seeds an editable override from what this venue would otherwise receive:
  // the tailored subject/hero (or master), with its hook woven into the body.
  const seedOverride = (v: EmailableVenue) => {
    const t = v.tailoring
    setOverride(v.key, {
      subject: t?.subject ?? subject,
      body:
        mode === "template"
          ? body
              .replace(/\{\{\s*hook\s*\}\}/gi, t?.hook ?? "")
              .replace(/\n{3,}/g, "\n\n")
              .trim()
          : "",
      heroUrl: mode === "template" ? t?.heroImage ?? heroUrl : "",
    })
  }

  const openPreview = () => {
    setPreviewOpen(true)
    setPreview(null)
    startPreview(async () => {
      const res = await renderVenuePreview({
        subject,
        content: buildContent(),
        sample: {
          venueName: previewVenue?.venueName ?? "",
          contactName: previewVenue?.contactName ?? "",
        },
        venue: previewVenue
          ? { source: previewVenue.source, id: previewVenue.id }
          : undefined,
        override: previewVenue ? overrides[previewVenue.key] : undefined,
      })
      setPreview(res)
    })
  }

  // ---- test send ----
  const [testEmail, setTestEmail] = useState(adminEmail)
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [testing, startTest] = useTransition()

  const sendTest = () => {
    setTestMsg(null)
    startTest(async () => {
      const res = await sendVenueTest({
        testEmail,
        subject,
        content: buildContent(),
        sample: {
          venueName: previewVenue?.venueName ?? "",
          contactName: previewVenue?.contactName ?? "",
        },
        venue: previewVenue
          ? { source: previewVenue.source, id: previewVenue.id }
          : undefined,
        override: previewVenue ? overrides[previewVenue.key] : undefined,
      })
      setTestMsg(
        res.ok
          ? { ok: true, text: `Test sent to ${testEmail}.` }
          : { ok: false, text: res.error ?? "Test failed." },
      )
    })
  }

  // ---- send ----
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const contentReady =
    mode === "html" ? rawHtml.trim().length > 0 : body.trim().length > 0
  const canSend = selected.size > 0 && subject.trim().length > 0 && contentReady

  const doSend = () => {
    setResult(null)
    const keys = [...selected]
    startSending(async () => {
      const res = await sendVenueCampaign({
        recipientKeys: keys,
        subject,
        content: buildContent(),
        overrides,
      })
      setConfirmOpen(false)
      if (!res.ok && "error" in res) {
        setResult(res.error ?? "Send failed.")
        return
      }
      // Optimistically bump the pills for everyone we just emailed.
      keys.forEach((k) => {
        const v = venues.find((x) => x.key === k)
        if (v) markSent(v)
      })
      const parts = [`${res.sent} sent`]
      if (res.failed) parts.push(`${res.failed} failed`)
      if (res.skipped) parts.push(`${res.skipped} skipped`)
      setResult(`Campaign complete — ${parts.join(" · ")} of ${res.total}.`)
      setSelected(new Set())
      router.refresh()
    })
  }


  return (
    <div className="flex flex-col gap-6">
      {!emailConfigured && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber-soft">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p>Email isn&apos;t connected yet (set RESEND_API_KEY).</p>
            <p className="mt-1 text-amber-soft/80">
              Sends will be logged as &quot;skipped&quot; so you can still preview the flow.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* -------------------- Recipients -------------------- */}
        <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-ink2 p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-cream">
              <Users className="h-4 w-4 text-flame" />
              Recipients
            </h2>
            <span className="rounded-full bg-flame/15 px-2.5 py-0.5 text-xs font-medium text-flame">
              {selected.size} selected
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, contact or email"
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-cream2">Source</Label>
              <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as typeof sourceFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="directory">Directory</SelectItem>
                  <SelectItem value="signup">Signed up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-cream2">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="not-sent">Not sent</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between border-y border-hairline py-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-cream2 hover:text-cream">
              <Checkbox
                checked={allFilteredSelected}
                onCheckedChange={toggleAllFiltered}
              />
              Select all ({selectableFiltered.length})
            </label>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs text-mute hover:text-cream2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex max-h-[420px] flex-col gap-1.5 overflow-y-auto">
            {filtered.length ? (
              filtered.map((v) => {
                const checked = selected.has(v.key)
                return (
                  <div
                    key={v.key}
                    role={v.emailable ? "button" : undefined}
                    tabIndex={v.emailable ? 0 : undefined}
                    onClick={() => v.emailable && toggle(v.key)}
                    onKeyDown={(e) => {
                      if (v.emailable && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault()
                        toggle(v.key)
                      }
                    }}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      checked
                        ? "border-flame/40 bg-flame/10"
                        : v.emailable
                          ? "cursor-pointer border-hairline bg-ink hover:bg-ink3"
                          : "border-hairline bg-ink/60"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={!v.emailable}
                      onCheckedChange={() => v.emailable && toggle(v.key)}
                      aria-label={`Select ${v.venueName}`}
                      tabIndex={-1}
                      className="pointer-events-none"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <ConfidenceDot confidence={v.confidence} />
                        <span
                          className={`truncate font-medium ${v.emailable ? "text-cream" : "text-mute"}`}
                        >
                          {v.venueName}
                        </span>
                        <Badge
                          variant="outline"
                          className="shrink-0 gap-1 border-hairline text-[10px] text-mute"
                        >
                          {v.source === "directory" ? (
                            <BookMarked className="h-2.5 w-2.5" />
                          ) : (
                            <Store className="h-2.5 w-2.5" />
                          )}
                          {v.source}
                        </Badge>
                        {v.timesSent > 0 && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                            <Check className="h-2.5 w-2.5" />
                            Sent{v.timesSent > 1 ? ` ${v.timesSent}×` : ""}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-mute">
                        {v.emailable ? (
                          <span className="truncate">{v.email}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-soft/80">
                            <Ban className="h-3 w-3" /> no valid email
                          </span>
                        )}
                        {mounted && v.lastSentAt && (
                          <span className="inline-flex shrink-0 items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatSent(v.lastSentAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="py-8 text-center text-sm text-mute">
                No venues match these filters.
              </p>
            )}
          </div>
        </div>

        {/* -------------------- Compose -------------------- */}
        <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="font-display text-lg font-semibold text-cream">Compose</h2>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject" className="text-cream2">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="{{venueName}} x BamSip"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-mute">A/B test variants — click to use:</span>
              <div className="flex flex-wrap gap-1.5">
                {VENUE_LAUNCH_SUBJECTS.map((s, i) => {
                  const active = subject === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className={`rounded-full border px-2.5 py-1 text-left text-xs transition-colors ${
                        active
                          ? "border-flame bg-flame/15 text-flame"
                          : "border-hairline bg-ink text-cream2 hover:bg-ink3"
                      }`}
                      title={s}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + i)}</span>
                      <span className="ml-1.5 text-mute">{s}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("template")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                mode === "template"
                  ? "border-flame bg-flame/15 text-flame"
                  : "border-hairline text-cream2 hover:bg-ink3"
              }`}
            >
              <Mail className="h-4 w-4" />
              Branded template
            </button>
            <button
              type="button"
              onClick={() => setMode("html")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                mode === "html"
                  ? "border-flame bg-flame/15 text-flame"
                  : "border-hairline text-cream2 hover:bg-ink3"
              }`}
            >
              <Code className="h-4 w-4" />
              Raw HTML
            </button>
          </div>

          {mode === "template" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="hero" className="text-cream2">
                  Hero image URL
                </Label>
                <Input
                  id="hero"
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  placeholder="https://www.bamsip.com/images/..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="headline" className="text-cream2">
                  Headline
                </Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="smarter nights out start here"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="body" className="text-cream2">
                  Body
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={7}
                  placeholder="Hi {{contactName}}, ..."
                />
                <p className="text-xs text-mute">
                  Blank lines start new paragraphs. Tokens: {"{{venueName}}"},{" "}
                  {"{{contactName}}"}, {"{{firstName}}"}.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ctaLabel" className="text-cream2">
                    Button label
                  </Label>
                  <Input
                    id="ctaLabel"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    placeholder="Get the venue details"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ctaUrl" className="text-cream2">
                    Button URL
                  </Label>
                  <Input
                    id="ctaUrl"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://bamsip.com/venues"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rawHtml" className="text-cream2">
                HTML
              </Label>
              <Textarea
                id="rawHtml"
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
                rows={14}
                className="font-mono text-xs"
                placeholder="<div>Hi {{contactName}}, ...</div>"
              />
              <p className="text-xs text-mute">
                Paste full HTML. Tokens {"{{venueName}}"}, {"{{contactName}}"} and{" "}
                {"{{firstName}}"} are replaced per venue.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-cream2">Preview as</Label>
            <div className="flex gap-2">
              <Select
                value={previewVenue?.key ?? ""}
                onValueChange={setPreviewKey}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pick a venue to personalize for" />
                </SelectTrigger>
                <SelectContent>
                  {previewOptions.map((v) => (
                    <SelectItem key={v.key} value={v.key}>
                      {v.venueName}
                      {v.contactName ? ` — ${v.contactName}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={openPreview}
                className="shrink-0 border-hairline"
                disabled={!contentReady}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
            <p className="text-xs text-mute">
              Tokens fill in for this venue. Defaults to your first selected
              recipient.
            </p>
          </div>

          {/* selected venue tailoring */}
          {previewVenue && (
            <div className="rounded-xl border border-hairline bg-ink p-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-cream2">This venue</Label>
                {previewVenue.tailoring ? (
                  <Badge className="gap-1 border-flame/40 bg-flame/15 text-flame">
                    <Sparkles className="h-3 w-3" />
                    Tailored
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-hairline text-mute">
                    Generic template
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-cream">
                {previewVenue.venueName}
              </p>

              {previewVenue.tailoring && (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-xs italic leading-relaxed text-cream2">
                    {`"${previewVenue.tailoring.hook}"`}
                  </p>
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewVenue.tailoring.heroImage || "/placeholder.svg"}
                      alt={previewVenue.tailoring.heroAlt}
                      className="h-12 w-20 shrink-0 rounded-md object-cover ring-1 ring-hairline"
                    />
                    <span className="break-all text-[11px] text-mute">
                      {previewVenue.tailoring.heroImage}
                    </span>
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs text-mute">
                Subject:{" "}
                <span className="text-cream2">
                  {currentOverride?.subject ??
                    previewVenue.tailoring?.subject ??
                    subject}
                </span>
              </p>

              {currentOverride ? (
                <div className="mt-3 flex flex-col gap-2 rounded-lg border border-flame/30 bg-flame/5 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-cream2">
                      Custom for this venue
                    </span>
                    <button
                      type="button"
                      onClick={() => setOverride(previewVenue.key, null)}
                      className="text-xs text-flame hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={currentOverride.subject ?? ""}
                    onChange={(e) =>
                      setOverride(previewVenue.key, { subject: e.target.value })
                    }
                    placeholder="Custom subject"
                  />
                  {mode === "template" && (
                    <>
                      <Textarea
                        value={currentOverride.body ?? ""}
                        onChange={(e) =>
                          setOverride(previewVenue.key, { body: e.target.value })
                        }
                        rows={6}
                        placeholder="Custom body"
                        className="font-mono text-xs"
                      />
                      <Input
                        value={currentOverride.heroUrl ?? ""}
                        onChange={(e) =>
                          setOverride(previewVenue.key, { heroUrl: e.target.value })
                        }
                        placeholder="Custom hero image URL"
                      />
                    </>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => seedOverride(previewVenue)}
                  className="mt-3 h-8 border-hairline px-2.5 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Customise for this venue
                </Button>
              )}
            </div>
          )}

          {/* test send */}
          <div className="rounded-xl border border-hairline bg-ink p-3">
            <Label className="text-cream2">Send a test first</Label>
            <div className="mt-2 flex gap-2">
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="you@bamsip.com"
                type="email"
              />
              <Button
                type="button"
                variant="outline"
                onClick={sendTest}
                disabled={testing || !contentReady}
                className="shrink-0 border-hairline"
              >
                {testing ? "Sending…" : "Send test"}
              </Button>
            </div>
            {testMsg && (
              <p className={`mt-2 text-xs ${testMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                {testMsg.text}
              </p>
            )}
          </div>

          {result && (
            <p className="flex items-center gap-2 rounded-lg bg-ink3 px-3 py-2 text-sm text-cream2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {result}
            </p>
          )}

          <Button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={!canSend || isSending}
            className="bg-flame text-cream hover:bg-flame-soft"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending…" : `Send to ${selected.size} venue${selected.size === 1 ? "" : "s"}`}
          </Button>
        </div>
      </div>

      {/* preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Email preview</DialogTitle>
            <DialogDescription>
              {previewing
                ? "Rendering…"
                : preview
                  ? `Subject: ${preview.subject}`
                  : ""}
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <iframe
              title="Email preview"
              srcDoc={preview.html}
              className="h-[460px] w-full rounded-lg border border-hairline bg-white"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send campaign?</DialogTitle>
            <DialogDescription>
              This will email{" "}
              <strong className="text-cream">
                {selected.size} venue{selected.size === 1 ? "" : "s"}
              </strong>
              . Each email is personalised before sending. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="border-hairline">
              Cancel
            </Button>
            <Button
              onClick={doSend}
              disabled={isSending}
              className="bg-flame text-cream hover:bg-flame-soft"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Sending…" : "Confirm & send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const CONFIDENCE_COLOR: Record<string, string> = {
  high: "bg-success",
  "operator-level": "bg-sky-400",
  medium: "bg-amber",
  "needs-research": "bg-orange-400",
  low: "bg-mute",
}

function ConfidenceDot({ confidence }: { confidence: string | null }) {
  if (!confidence) return null
  const color = CONFIDENCE_COLOR[confidence] ?? "bg-mute"
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${color}`}
      title={`${confidence} confidence`}
      aria-label={`${confidence} confidence`}
    />
  )
}

function formatSent(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const diffMs = Date.now() - d.getTime()
  const day = 86_400_000
  if (diffMs < day && d.getDate() === new Date().getDate()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diffMs < 7 * day) {
    return d.toLocaleDateString([], { weekday: "short" })
  }
  return d.toLocaleDateString([], { day: "numeric", month: "short" })
}

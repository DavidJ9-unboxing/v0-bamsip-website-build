"use client"

import { useMemo, useState, useTransition } from "react"
import {
  updateDirectoryVenue,
  deleteDirectoryVenue,
} from "@/app/actions/directory"
import { StatusBadge } from "@/components/admin/status-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Search,
  Trash2,
  Phone,
  Smartphone,
  Mail,
  Building2,
  Instagram,
  Facebook,
  Globe,
  MapPin,
  User,
  ExternalLink,
  Download,
  Info,
} from "lucide-react"
import { useRouter } from "next/navigation"

type Directory = {
  id: number
  name: string
  category: string | null
  address: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  owner: string | null
  role: string | null
  contactUrl: string | null
  source: string | null
  confidence: string | null
  description: string | null
  phone: string | null
  phoneSecondary: string | null
  mobile: string | null
  mobileSecondary: string | null
  smsOptIn: boolean
  email: string | null
  status: string
  signupId: number | null
  notes: string | null
  createdAt: Date | null
}

type Stats = {
  total: number
  prospect: number
  pending: number
  signedUp: number
  withMobile: number
}

const STATUSES = ["all", "prospect", "pending", "signed_up"] as const

export function DirectoryTable({
  initial,
  stats,
  categories,
}: {
  initial: Directory[]
  stats: Stats
  categories: string[]
}) {
  const router = useRouter()
  const [rows, setRows] = useState(initial)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [category, setCategory] = useState<string>("all")
  const [selected, setSelected] = useState<Directory | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false
      if (category !== "all" && r.category !== category) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) ||
        (r.address ?? "").toLowerCase().includes(q) ||
        (r.owner ?? "").toLowerCase().includes(q) ||
        (r.instagram ?? "").toLowerCase().includes(q)
      )
    })
  }, [rows, query, status, category])

  const patchRow = (updated: Directory) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setSelected(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold text-cream">
            Venue directory
          </h1>
          <p className="max-w-2xl text-sm text-mute">
            Our researched outreach list — {stats.total} venues. No emails or
            SMS are sent to these contacts until they sign up.
          </p>
        </div>
        <button
          onClick={() => exportCsv(filtered)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline px-3 py-2 text-sm text-cream2 transition-colors hover:bg-ink3 hover:text-cream"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Prospects" value={stats.prospect} />
        <StatCard label="Pending" value={stats.pending} tone="amber" />
        <StatCard label="Signed up" value={stats.signedUp} tone="success" />
        <StatCard label="With mobile" value={stats.withMobile} />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <Input
            placeholder="Search name, address, owner or handle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors ${
                status === s
                  ? "border-flame bg-flame/15 text-flame"
                  : "border-hairline text-cream2 hover:bg-ink3"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-hairline bg-ink px-3 py-2 text-xs text-cream2"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-mute">
        Showing {filtered.length} of {rows.length}
      </p>

      {/* Table */}
      <div className="rounded-2xl border border-hairline">
        <div className="max-h-[calc(100svh-220px)] overflow-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="sticky top-0 z-10 bg-ink2 px-4 py-3 font-medium">Venue</th>
                <th className="sticky top-0 z-10 bg-ink2 px-4 py-3 font-medium">Category</th>
                <th className="sticky top-0 z-10 bg-ink2 px-4 py-3 font-medium">Phone</th>
                <th className="sticky top-0 z-10 bg-ink2 px-4 py-3 font-medium">Contact</th>
                <th className="sticky top-0 z-10 bg-ink2 px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer bg-ink transition-colors hover:bg-ink2"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-cream">{r.name}</div>
                    {r.address && (
                      <div className="line-clamp-1 max-w-[260px] text-xs text-mute">
                        {r.address}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-cream2">{r.category ?? "—"}</td>
                  <td className="px-4 py-3 text-cream2">
                    <div className="flex flex-col gap-0.5 text-xs">
                      {r.phone && (
                        <span className="flex items-center gap-1 text-mute">
                          <Phone className="h-3 w-3" /> {r.phone}
                        </span>
                      )}
                      {r.mobile && (
                        <span className="flex items-center gap-1 text-cream2">
                          <Smartphone className="h-3 w-3" /> {r.mobile}
                        </span>
                      )}
                      {!r.phone && !r.mobile && <span className="text-mute">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-mute">
                      {r.instagram && <Instagram className="h-4 w-4" />}
                      {r.facebook && <Facebook className="h-4 w-4" />}
                      {r.website && <Globe className="h-4 w-4" />}
                      {r.email && <Mail className="h-4 w-4 text-cream2" />}
                      {r.description && (
                        <Info
                          className="h-4 w-4 text-flame"
                          aria-label="Venue information available"
                        />
                      )}
                      {!r.instagram &&
                        !r.facebook &&
                        !r.website &&
                        !r.email &&
                        !r.description && <span className="text-xs">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-mute">
                    No venues match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailSheet
        selected={selected}
        onClose={() => setSelected(null)}
        onPatch={patchRow}
        onDeleted={(id) => {
          setRows((prev) => prev.filter((r) => r.id !== id))
          setSelected(null)
          router.refresh()
        }}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: "amber" | "success"
}) {
  const color =
    tone === "amber"
      ? "text-amber"
      : tone === "success"
        ? "text-success"
        : "text-cream"
  return (
    <div className="rounded-2xl border border-hairline bg-ink2 p-4">
      <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-mute">{label}</div>
    </div>
  )
}

function DetailSheet({
  selected,
  onClose,
  onPatch,
  onDeleted,
}: {
  selected: Directory | null
  onClose: () => void
  onPatch: (d: Directory) => void
  onDeleted: (id: number) => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const save = (patch: Partial<Directory>) => {
    if (!selected) return
    const next = { ...selected, ...patch }
    onPatch(next)
    startTransition(async () => {
      await updateDirectoryVenue(selected.id, {
        mobile: next.mobile ?? "",
        mobileSecondary: next.mobileSecondary ?? "",
        phoneSecondary: next.phoneSecondary ?? "",
        email: next.email ?? "",
        smsOptIn: next.smsOptIn,
        status: next.status,
        notes: next.notes ?? "",
      })
      router.refresh()
    })
  }

  return (
    <Sheet open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-hairline bg-ink2 text-cream sm:max-w-lg">
        {selected && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-cream">
                <Building2 className="h-5 w-5 text-flame" />
                {selected.name}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-4 text-sm">
              {/* Quick facts */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selected.status} />
                {selected.category && (
                  <span className="rounded-full bg-ink3 px-2.5 py-0.5 text-xs text-cream2">
                    {selected.category}
                  </span>
                )}
                {selected.confidence && (
                  <span className="rounded-full bg-ink3 px-2.5 py-0.5 text-xs text-mute">
                    {selected.confidence} confidence
                  </span>
                )}
                {selected.signupId && (
                  <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
                    linked signup #{selected.signupId}
                  </span>
                )}
              </div>

              {selected.description && (
                <p className="text-cream2">{selected.description}</p>
              )}

              <dl className="flex flex-col gap-2 rounded-xl border border-hairline bg-ink p-3">
                {selected.address && (
                  <Row icon={MapPin} value={selected.address} />
                )}
                {selected.owner && (
                  <Row
                    icon={User}
                    value={`${selected.owner}${selected.role ? ` · ${selected.role}` : ""}`}
                  />
                )}
                {selected.website && (
                  <LinkRow icon={Globe} href={externalUrl(selected.website)} value={selected.website} />
                )}
                {selected.instagram && (
                  <LinkRow
                    icon={Instagram}
                    href={instaUrl(selected.instagram)}
                    value={selected.instagram}
                  />
                )}
                {selected.facebook && (
                  <LinkRow icon={Facebook} href={externalUrl(selected.facebook)} value={selected.facebook} />
                )}
                {selected.contactUrl && (
                  <LinkRow
                    icon={ExternalLink}
                    href={externalUrl(selected.contactUrl)}
                    value="Contact page"
                  />
                )}
                {selected.source && (
                  <div className="text-xs text-mute">Source: {selected.source}</div>
                )}
              </dl>

              {/* Landlines (research) */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Landline">
                  <div className="flex items-center gap-2 text-cream2">
                    <Phone className="h-4 w-4 text-mute" />
                    {selected.phone ?? "—"}
                  </div>
                </Field>
                <EditField
                  label="Landline 2"
                  defaultValue={selected.phoneSecondary ?? ""}
                  onSave={(v) => save({ phoneSecondary: v })}
                  placeholder="Add second line"
                />
              </div>

              {/* Mobiles (SMS-capable) */}
              <div className="rounded-xl border border-hairline bg-ink p-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-mute">
                  <Smartphone className="h-3.5 w-3.5" /> Mobile numbers (for SMS)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <EditField
                    label="Mobile"
                    defaultValue={selected.mobile ?? ""}
                    onSave={(v) => save({ mobile: v })}
                    placeholder="07…"
                  />
                  <EditField
                    label="Mobile 2"
                    defaultValue={selected.mobileSecondary ?? ""}
                    onSave={(v) => save({ mobileSecondary: v })}
                    placeholder="07…"
                  />
                </div>
                <label className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-cream2">SMS opt-in</span>
                  <Switch
                    checked={selected.smsOptIn}
                    onCheckedChange={(v) => save({ smsOptIn: v })}
                  />
                </label>
              </div>

              <EditField
                label="Email"
                type="email"
                defaultValue={selected.email ?? ""}
                onSave={(v) => save({ email: v })}
                placeholder="Add email once known"
                icon={Mail}
              />

              {/* Status */}
              <div>
                <Label className="text-cream2">Status</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["prospect", "pending", "signed_up"].map((s) => (
                    <button
                      key={s}
                      disabled={isPending}
                      onClick={() => save({ status: s })}
                      className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors ${
                        selected.status === s
                          ? "border-flame bg-flame/15 text-flame"
                          : "border-hairline text-cream2 hover:bg-ink3"
                      }`}
                    >
                      {s.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="dnotes" className="text-cream2">
                  Notes
                </Label>
                <Textarea
                  id="dnotes"
                  defaultValue={selected.notes ?? ""}
                  placeholder="Internal notes..."
                  className="mt-2"
                  onBlur={(e) => save({ notes: e.target.value })}
                />
              </div>

              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteDirectoryVenue(selected.id)
                    onDeleted(selected.id)
                  })
                }
                className="mt-2 flex items-center gap-1.5 self-start rounded-lg border border-error/40 px-3 py-2 text-xs text-error transition-colors hover:bg-error/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete from directory
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function exportCsv(rows: Directory[]) {
  const headers = [
    "id", "name", "category", "address", "owner", "role",
    "website", "instagram", "facebook", "email",
    "phone", "phone_secondary", "mobile", "mobile_secondary",
    "sms_opt_in", "status", "confidence", "source", "signup_id", "notes",
  ]
  const esc = (v: string | number | null) => {
    const s = v == null ? "" : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = rows.map((r) =>
    [
      r.id, r.name, r.category, r.address, r.owner, r.role,
      r.website, r.instagram, r.facebook, r.email,
      r.phone, r.phoneSecondary, r.mobile, r.mobileSecondary,
      r.smsOptIn ? "yes" : "no", r.status, r.confidence, r.source,
      r.signupId, r.notes,
    ].map(esc).join(","),
  )
  const csv = [headers.join(","), ...lines].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `bamsip-venue-directory-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function instaUrl(handle: string) {
  if (handle.startsWith("http")) return handle
  return `https://instagram.com/${handle.replace(/^@/, "")}`
}

function externalUrl(url: string) {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, "")}`
}

function Row({
  icon: Icon,
  value,
}: {
  icon: React.ElementType
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-cream2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-mute" />
      <span className="break-words">{value}</span>
    </div>
  )
}

function LinkRow({
  icon: Icon,
  href,
  value,
}: {
  icon: React.ElementType
  href: string
  value: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-flame hover:underline"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="break-all">{value}</span>
    </a>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-mute">{label}</span>
      {children}
    </div>
  )
}

function EditField({
  label,
  defaultValue,
  onSave,
  placeholder,
  type = "text",
  icon: Icon,
}: {
  label: string
  defaultValue: string
  onSave: (value: string) => void
  placeholder?: string
  type?: string
  icon?: React.ElementType
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-mute">{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        )}
        <Input
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={Icon ? "pl-9" : ""}
          onBlur={(e) => {
            if (e.target.value !== defaultValue) onSave(e.target.value)
          }}
        />
      </div>
    </div>
  )
}

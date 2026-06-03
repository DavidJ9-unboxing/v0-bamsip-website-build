"use client"

import { useState, useTransition } from "react"
import {
  addVenueManually,
  updateVenueStatus,
  updateVenueNotes,
  deleteVenue,
} from "@/app/actions/admin"
import { StatusBadge } from "@/components/admin/status-badge"
import { ExportButton } from "@/components/admin/export-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Search, Plus, Trash2, Phone, Mail, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Venue = {
  id: number
  venueName: string
  contactName: string
  email: string
  phone: string | null
  role: string | null
  smsOptIn: boolean
  venueType: string | null
  goal: string | null
  challenge: string | null
  status: string
  source: string
  notes: string | null
  createdAt: Date | null
}

const TYPE_LABELS: Record<string, string> = {
  bar: "Bar",
  club: "Nightclub",
  pub: "Pub",
  "live-venue": "Live music venue",
  restaurant: "Restaurant / bar",
  other: "Other",
}
const GOAL_LABELS: Record<string, string> = {
  "fill-quiet": "Fill quiet nights",
  "new-customers": "Reach new customers",
  "promote-events": "Promote events",
  "boost-midweek": "Boost midweek trade",
}

export function VenuesTable({ initial }: { initial: Venue[] }) {
  const router = useRouter()
  const [rows] = useState(initial)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Venue | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = rows.filter((r) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      r.venueName.toLowerCase().includes(q) ||
      r.contactName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Venues</h1>
          <p className="text-sm text-mute">{rows.length} interested</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton kind="venues" />
          <AddVenueDialog />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        <Input
          placeholder="Search venue, contact or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink2 text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-4 py-3 font-medium">Venue</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
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
                    <div className="font-medium text-cream">{r.venueName}</div>
                    <div className="text-xs text-mute">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cream2">
                    <div>{r.contactName}</div>
                    <div className="text-xs text-mute">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-cream2">
                    {r.venueType ? TYPE_LABELS[r.venueType] ?? r.venueType : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-mute">
                    No venues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="overflow-y-auto border-hairline bg-ink2 text-cream">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-cream">
                  <Building2 className="h-5 w-5 text-flame" />
                  {selected.venueName}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-4 text-sm">
                <div className="text-cream2">
                  <span className="text-mute">Contact: </span>
                  {selected.contactName}
                  {selected.role && (
                    <span className="text-mute"> · {selected.role}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-cream2">
                  <Mail className="h-4 w-4 text-mute" />
                  {selected.email}
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-cream2">
                    <Phone className="h-4 w-4 text-mute" />
                    {selected.phone}
                  </div>
                )}

                <dl className="grid grid-cols-2 gap-3 rounded-xl border border-hairline bg-ink p-3">
                  <Detail
                    label="Type"
                    value={
                      selected.venueType
                        ? TYPE_LABELS[selected.venueType] ?? selected.venueType
                        : "—"
                    }
                  />
                  <Detail
                    label="Main goal"
                    value={
                      selected.goal
                        ? GOAL_LABELS[selected.goal] ?? selected.goal
                        : "—"
                    }
                  />
                  <Detail label="Source" value={selected.source} />
                </dl>

                {selected.challenge && (
                  <div className="rounded-xl border border-hairline bg-ink p-3">
                    <p className="text-xs text-mute">Biggest challenge</p>
                    <p className="mt-1 text-cream2">{selected.challenge}</p>
                  </div>
                )}

                <div>
                  <Label className="text-cream2">Status</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["pending", "confirmed", "unsubscribed"].map((s) => (
                      <button
                        key={s}
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            await updateVenueStatus(selected.id, s)
                            setSelected({ ...selected, status: s })
                            router.refresh()
                          })
                        }
                        className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors ${
                          selected.status === s
                            ? "border-flame bg-flame/15 text-flame"
                            : "border-hairline text-cream2 hover:bg-ink3"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="vnotes" className="text-cream2">
                    Notes
                  </Label>
                  <Textarea
                    id="vnotes"
                    defaultValue={selected.notes ?? ""}
                    placeholder="Internal notes..."
                    className="mt-2"
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateVenueNotes(selected.id, e.target.value)
                        router.refresh()
                      })
                    }
                  />
                </div>

                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteVenue(selected.id)
                      setSelected(null)
                      router.refresh()
                    })
                  }
                  className="mt-2 flex items-center gap-1.5 self-start rounded-lg border border-error/40 px-3 py-2 text-xs text-error transition-colors hover:bg-error/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-mute">{label}</dt>
      <dd className="mt-0.5 break-words text-cream2">{value}</dd>
    </div>
  )
}

function AddVenueDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-flame text-cream hover:bg-flame-soft">
          <Plus className="h-4 w-4" />
          Add venue
        </Button>
      </DialogTrigger>
      <DialogContent className="border-hairline bg-ink2 text-cream">
        <DialogHeader>
          <DialogTitle>Add a venue manually</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            setError(null)
            startTransition(async () => {
              try {
                await addVenueManually({
                  venueName: String(formData.get("venueName") || ""),
                  contactName: String(formData.get("contactName") || ""),
                  email: String(formData.get("email") || ""),
                  phone: String(formData.get("phone") || ""),
                  role: String(formData.get("role") || ""),
                  notes: String(formData.get("notes") || ""),
                })
                setOpen(false)
                router.refresh()
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to add")
              }
            })
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="venueName">Venue name</Label>
            <Input id="venueName" name="venueName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactName">Contact name</Label>
            <Input id="contactName" name="contactName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" placeholder="e.g. Manager" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-flame text-cream hover:bg-flame-soft"
            >
              {isPending ? "Adding..." : "Add venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

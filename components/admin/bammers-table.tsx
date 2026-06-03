"use client"

import { useState, useTransition } from "react"
import {
  addBammerManually,
  updateBammerStatus,
  updateBammerNotes,
  deleteBammer,
} from "@/app/actions/admin"
import { StatusBadge } from "@/components/admin/status-badge"
import { ExportButton } from "@/components/admin/export-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Search, Plus, Trash2, Phone, Mail, Gift } from "lucide-react"
import { useRouter } from "next/navigation"

type Bammer = {
  id: number
  name: string
  email: string
  phone: string | null
  smsOptIn: boolean
  vibe: string | null
  frequency: string | null
  motivation: string | null
  referralCode: string
  referredBy: string | null
  paypalEmail: string | null
  status: string
  source: string
  notes: string | null
  createdAt: Date | null
  referralCount: number
}

const VIBE_LABELS: Record<string, string> = {
  "big-energy": "Big energy / clubs",
  "chilled-bars": "Chilled bars",
  "live-music": "Live music & gigs",
  "food-drinks": "Food & drinks",
  surprise: "Surprise me",
}
const MOTIV_LABELS: Record<string, string> = {
  "save-money": "Save money",
  "discover-places": "Discover places",
  "plan-friends": "Plan with friends",
  "events-gigs": "Events & gigs",
}

export function BammersTable({ initial }: { initial: Bammer[] }) {
  const router = useRouter()
  const [rows] = useState(initial)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Bammer | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = rows.filter((r) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone ?? "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Bammers</h1>
          <p className="text-sm text-mute">{rows.length} registered</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton kind="bammers" />
          <AddBammerDialog />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        <Input
          placeholder="Search name, email or phone..."
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Vibe</th>
                <th className="px-4 py-3 font-medium">Referrals</th>
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
                    <div className="font-medium text-cream">{r.name}</div>
                    <div className="text-xs text-mute">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cream2">
                    <div>{r.email}</div>
                    {r.phone && (
                      <div className="text-xs text-mute">
                        {r.phone}{" "}
                        {r.smsOptIn && (
                          <span className="text-success">· SMS ok</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-cream2">
                    {r.vibe ? VIBE_LABELS[r.vibe] ?? r.vibe : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-cream2">
                      <Gift className="h-3.5 w-3.5 text-flame" />
                      {r.referralCount}
                      <span className="text-mute">/50</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-mute">
                    No bammers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="overflow-y-auto border-hairline bg-ink2 text-cream">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-cream">{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-2 text-cream2">
                  <Mail className="h-4 w-4 text-mute" />
                  {selected.email}
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-cream2">
                    <Phone className="h-4 w-4 text-mute" />
                    {selected.phone}
                    {selected.smsOptIn && (
                      <span className="text-xs text-success">· texts ok</span>
                    )}
                  </div>
                )}

                <dl className="grid grid-cols-2 gap-3 rounded-xl border border-hairline bg-ink p-3">
                  <Detail label="Go-to night" value={selected.vibe ? VIBE_LABELS[selected.vibe] ?? selected.vibe : "—"} />
                  <Detail label="Frequency" value={selected.frequency ?? "—"} />
                  <Detail label="Wants" value={selected.motivation ? MOTIV_LABELS[selected.motivation] ?? selected.motivation : "—"} />
                  <Detail label="Source" value={selected.source} />
                  <Detail label="Referral code" value={selected.referralCode} />
                  <Detail label="Referred by" value={selected.referredBy ?? "—"} />
                  <Detail label="Confirmed referrals" value={`${selected.referralCount} / 50`} />
                  <Detail label="PayPal" value={selected.paypalEmail ?? "—"} />
                </dl>

                <div>
                  <Label className="text-cream2">Status</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["pending", "confirmed", "unsubscribed"].map((s) => (
                      <button
                        key={s}
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            await updateBammerStatus(selected.id, s)
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
                  <Label htmlFor="notes" className="text-cream2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    defaultValue={selected.notes ?? ""}
                    placeholder="Internal notes..."
                    className="mt-2"
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateBammerNotes(selected.id, e.target.value)
                        router.refresh()
                      })
                    }
                  />
                </div>

                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteBammer(selected.id)
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

function AddBammerDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-flame text-cream hover:bg-flame-soft">
          <Plus className="h-4 w-4" />
          Add bammer
        </Button>
      </DialogTrigger>
      <DialogContent className="border-hairline bg-ink2 text-cream">
        <DialogHeader>
          <DialogTitle>Add a bammer manually</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            setError(null)
            startTransition(async () => {
              try {
                await addBammerManually({
                  name: String(formData.get("name") || ""),
                  email: String(formData.get("email") || ""),
                  phone: String(formData.get("phone") || ""),
                  smsOptIn: formData.get("smsOptIn") === "on",
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
          <label className="flex items-center gap-2 text-sm text-cream2">
            <Checkbox name="smsOptIn" />
            They&apos;re happy to receive texts
          </label>
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
              {isPending ? "Adding..." : "Add bammer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

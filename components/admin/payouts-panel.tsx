"use client"

import { useState, useTransition } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/admin/export-button"
import {
  sendPayoutNow,
  markPayoutPaid,
  setPayoutPaypalEmail,
  approvePayout,
} from "@/app/actions/admin"
import { Check, Send, Pencil, AlertCircle, ShieldCheck, Lock } from "lucide-react"

type Payout = {
  id: number
  bammerId: number
  paypalEmail: string
  amountGbp: number
  referralsSnapshot: number
  status: string
  error: string | null
  createdAt: Date
  paidAt: Date | null
  bammerName: string | null
  bammerEmail: string | null
}

const statusStyles: Record<string, string> = {
  owed: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  failed: "bg-red-500/15 text-red-700 dark:text-red-400",
  needs_approval: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  needs_details: "bg-muted text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  needs_approval: "needs approval",
  needs_details: "needs details",
}

export function PayoutsPanel({
  payouts,
  paypalConfigured,
  totalOwed,
  adminEmail,
  approverEmail,
}: {
  payouts: Payout[]
  paypalConfigured: boolean
  totalOwed: number
  adminEmail: string
  approverEmail: string
}) {
  const canApprove =
    adminEmail.toLowerCase() === approverEmail.toLowerCase()
  const [rows, setRows] = useState(payouts)
  const [editing, setEditing] = useState<number | null>(null)
  const [emailDraft, setEmailDraft] = useState("")
  const [pending, setPending] = useState<number | null>(null)
  const [, startT] = useTransition()

  function update(id: number, patch: Partial<Payout>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function handleSend(id: number) {
    setPending(id)
    startT(async () => {
      const res = await sendPayoutNow(id)
      if (res?.ok) {
        update(id, { status: "paid", paidAt: new Date(), error: null })
      } else if (res && "skipped" in res && res.skipped) {
        update(id, {
          error: "PayPal not configured — add PayPal API keys to send.",
        })
      } else {
        update(id, { status: "failed" })
      }
      setPending(null)
    })
  }

  function handleApprove(id: number) {
    setPending(id)
    startT(async () => {
      const res = await approvePayout(id)
      if (res?.ok) {
        update(id, { status: "owed", error: null })
      } else {
        update(id, { error: res?.error ?? "Could not approve." })
      }
      setPending(null)
    })
  }

  function handleMarkPaid(id: number) {
    setPending(id)
    startT(async () => {
      await markPayoutPaid(id)
      update(id, { status: "paid", paidAt: new Date(), error: null })
      setPending(null)
    })
  }

  function handleSaveEmail(id: number) {
    startT(async () => {
      await setPayoutPaypalEmail(id, emailDraft)
      update(id, { paypalEmail: emailDraft })
      setEditing(null)
    })
  }

  return (
    <div className="space-y-4">
      {!paypalConfigured && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium text-foreground">
              PayPal payouts not configured yet
            </p>
            <p className="text-muted-foreground">
              Add{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                PAYPAL_CLIENT_ID
              </code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                PAYPAL_CLIENT_SECRET
              </code>{" "}
              to send real payments. Until then you can still track who&apos;s
              owed and mark payouts as paid manually.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            £{totalOwed}
          </span>{" "}
          approved across{" "}
          {rows.filter((r) => r.status === "owed").length} payout(s) ready to
          send
          {rows.filter((r) => r.status === "needs_approval").length > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-orange-600">
                {rows.filter((r) => r.status === "needs_approval").length}
              </span>{" "}
              awaiting approval
            </>
          )}
        </div>
        <ExportButton kind="payouts" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer</TableHead>
              <TableHead>PayPal email</TableHead>
              <TableHead className="text-center">Referrals</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No payouts yet. They appear automatically when a referrer hits
                  50 confirmed sign-ups.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.bammerName ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.bammerEmail}
                  </div>
                </TableCell>
                <TableCell>
                  {editing === r.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        className="h-8 w-44"
                        placeholder="paypal@email.com"
                      />
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => handleSaveEmail(r.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-1 text-left hover:underline"
                      onClick={() => {
                        setEditing(r.id)
                        setEmailDraft(r.paypalEmail)
                      }}
                    >
                      {r.paypalEmail || (
                        <span className="text-muted-foreground">
                          add email
                        </span>
                      )}
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {r.referralsSnapshot}
                </TableCell>
                <TableCell className="text-center font-medium">
                  £{r.amountGbp}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={statusStyles[r.status] ?? ""}
                  >
                    {statusLabels[r.status] ?? r.status}
                  </Badge>
                  {r.error && (
                    <div className="mt-1 text-[10px] leading-tight text-muted-foreground">
                      {r.error}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {r.status === "needs_approval" && (
                    <div className="flex justify-end gap-1">
                      {canApprove ? (
                        <Button
                          size="sm"
                          className="h-8 bg-orange-600 text-white hover:bg-orange-700"
                          disabled={pending === r.id}
                          onClick={() => handleApprove(r.id)}
                        >
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          Approve £{r.amountGbp}
                        </Button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          {approverEmail} approves
                        </span>
                      )}
                    </div>
                  )}
                  {r.status !== "paid" && r.status !== "needs_approval" && (
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        disabled={pending === r.id || !r.paypalEmail}
                        onClick={() => handleSend(r.id)}
                      >
                        <Send className="mr-1 h-3 w-3" />
                        Send £{r.amountGbp}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        disabled={pending === r.id}
                        onClick={() => handleMarkPaid(r.id)}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Mark paid
                      </Button>
                    </div>
                  )}
                  {r.status === "paid" && r.paidAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.paidAt).toLocaleDateString()}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

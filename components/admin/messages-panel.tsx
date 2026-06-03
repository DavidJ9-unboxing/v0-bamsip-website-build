"use client"

import { useState, useTransition } from "react"
import { sendBroadcast } from "@/app/actions/admin"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, Mail, MessageSquare, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

type LogRow = {
  id: number
  recipientType: string
  recipientContact: string
  channel: string
  template: string | null
  subject: string | null
  status: string
  error: string | null
  createdAt: Date | null
}

export function MessagesPanel({
  log,
  emailConfigured,
  smsConfigured,
}: {
  log: LogRow[]
  emailConfigured: boolean
  smsConfigured: boolean
}) {
  const router = useRouter()
  const [audience, setAudience] = useState<"bammers" | "venues">("bammers")
  const [segment, setSegment] = useState<"all" | "confirmed" | "sms-opt-in">(
    "confirmed",
  )
  const [channel, setChannel] = useState<"email" | "sms">("email")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const send = () => {
    setResult(null)
    startTransition(async () => {
      const res = await sendBroadcast({ audience, segment, channel, subject, body })
      setResult(
        `Queued for ${res.total} recipient${res.total === 1 ? "" : "s"} · ${res.sent} sent · ${res.skipped} skipped`,
      )
      setBody("")
      setSubject("")
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {(!emailConfigured || !smsConfigured) && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber-soft">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            {!emailConfigured && <p>Email isn&apos;t connected yet (set RESEND_API_KEY). </p>}
            {!smsConfigured && <p>SMS isn&apos;t connected yet (set Twilio keys). </p>}
            <p className="mt-1 text-amber-soft/80">
              Messages will still be logged so you can see what would be sent.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-ink2 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-cream2">Audience</Label>
              <Select
                value={audience}
                onValueChange={(v) => setAudience(v as typeof audience)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bammers">Bammers</SelectItem>
                  <SelectItem value="venues">Venues</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-cream2">Segment</Label>
              <Select
                value={segment}
                onValueChange={(v) => setSegment(v as typeof segment)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone</SelectItem>
                  <SelectItem value="confirmed">Confirmed only</SelectItem>
                  <SelectItem value="sms-opt-in">SMS opt-ins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-cream2">Channel</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setChannel("email")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  channel === "email"
                    ? "border-flame bg-flame/15 text-flame"
                    : "border-hairline text-cream2 hover:bg-ink3"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setChannel("sms")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  channel === "sms"
                    ? "border-flame bg-flame/15 text-flame"
                    : "border-hairline text-cream2 hover:bg-ink3"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                SMS
              </button>
            </div>
          </div>

          {channel === "email" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject" className="text-cream2">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="An update from BamSip"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="body" className="text-cream2">
              Message
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder={
                channel === "sms"
                  ? "Keep it short and sweet..."
                  : "Write your update..."
              }
            />
            {channel === "sms" && (
              <p className="text-xs text-mute">
                Only sent to recipients who opted in to texts and have a phone
                number.
              </p>
            )}
          </div>

          {result && (
            <p className="rounded-lg bg-ink3 px-3 py-2 text-sm text-cream2">
              {result}
            </p>
          )}

          <Button
            onClick={send}
            disabled={isPending || !body.trim()}
            className="bg-flame text-cream hover:bg-flame-soft"
          >
            <Send className="h-4 w-4" />
            {isPending ? "Sending..." : "Send broadcast"}
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-ink2 p-5">
          <h2 className="font-display text-lg font-semibold text-cream">
            Recent activity
          </h2>
          <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
            {log.length ? (
              log.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-ink px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-cream2">
                      {m.channel === "email" ? (
                        <Mail className="h-3.5 w-3.5 text-mute" />
                      ) : (
                        <MessageSquare className="h-3.5 w-3.5 text-mute" />
                      )}
                      <span className="truncate">{m.recipientContact}</span>
                    </div>
                    <div className="truncate text-xs text-mute">
                      {m.subject || m.template || m.channel}
                    </div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-mute">
                No messages sent yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Loader2, Check, Copy } from "lucide-react"
import { PhoneInput } from "@/components/phone-input"
import { registerBammer, registerVenue } from "@/app/actions/signups"

const bammerSchema = z.object({
  name: z.string().min(2, "enter your name"),
  email: z.string().email("enter a valid email"),
  phone: z.string().optional(),
  smsOptIn: z.boolean().optional(),
  vibe: z.string().min(1, "pick what you're after"),
  frequency: z.string().min(1, "pick one"),
  motivation: z.string().optional(),
})

const venueSchema = z.object({
  venueName: z.string().min(2, "enter your venue name"),
  contactName: z.string().min(2, "enter your name"),
  email: z.string().email("enter a valid email"),
  phone: z.string().optional(),
  role: z.string().min(1, "select your role"),
  smsOptIn: z.boolean().optional(),
  venueType: z.string().min(1, "pick your venue type"),
  goal: z.string().min(1, "pick your main goal"),
  challenge: z.string().optional(),
})

type BammerFormData = z.infer<typeof bammerSchema>
type VenueFormData = z.infer<typeof venueSchema>

interface SignupFormProps {
  variant: "bammer" | "venue"
  headline?: string
}

const labelClass = "mb-1.5 block text-xs font-medium text-cream2"

export function SignupForm({ variant, headline }: SignupFormProps) {
  const isVenue = variant === "venue"
  const fieldClass = isVenue
    ? "bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-amber focus:ring-amber"
    : "bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
  const textareaClass = isVenue
    ? "min-h-[72px] rounded-xl border-hairline bg-ink3 text-cream placeholder:text-mute focus:border-amber focus:ring-amber"
    : "min-h-[72px] rounded-xl border-hairline bg-ink3 text-cream placeholder:text-mute focus:border-flame focus:ring-flame"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [referredBy, setReferredBy] = useState<string | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  // Render the interactive form only after mount so browser extensions
  // (e.g. password managers) that inject DOM into inputs can't cause a
  // server/client hydration mismatch.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Capture referral code from URL (?ref=CODE)
  useEffect(() => {
    if (variant !== "bammer") return
    const params = new URLSearchParams(window.location.search)
    const ref = params.get("ref")
    if (ref) setReferredBy(ref.toUpperCase())
  }, [variant])

  const bammerForm = useForm<BammerFormData>({
    resolver: zodResolver(bammerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      smsOptIn: false,
      vibe: "",
      frequency: "",
      motivation: "",
    },
  })

  const venueForm = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      venueName: "",
      contactName: "",
      email: "",
      phone: "",
      role: "",
      smsOptIn: false,
      venueType: "",
      goal: "",
      challenge: "",
    },
  })

  const onSubmitBammer = async (data: BammerFormData) => {
    setIsSubmitting(true)
    try {
      const res = await registerBammer({ ...data, referredBy })
      if (res.ok) {
        if (res.referralCode) {
          setShareUrl(
            `${window.location.origin}/bammers?ref=${res.referralCode}`,
          )
        }
        setIsSuccess(true)
        bammerForm.reset()
      } else {
        bammerForm.setError("email", {
          message: res.error ?? "something went wrong",
        })
      }
    } catch (error) {
      console.error("[v0] Bammer signup error:", error)
      bammerForm.setError("email", { message: "something went wrong, try again" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitVenue = async (data: VenueFormData) => {
    setIsSubmitting(true)
    try {
      const res = await registerVenue(data)
      if (res.ok) {
        setIsSuccess(true)
        venueForm.reset()
      } else {
        venueForm.setError("email", {
          message: res.error ?? "something went wrong",
        })
      }
    } catch (error) {
      console.error("[v0] Venue interest error:", error)
      venueForm.setError("email", { message: "something went wrong, try again" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyShare = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) {
    return (
      <div className="w-full max-w-md" aria-hidden="true">
        <div className="h-[520px] rounded-2xl border border-hairline bg-ink3/40" />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-cream">
          {variant === "bammer" ? "check your email." : "we'll be in touch."}
        </h3>
        <p className="text-sm text-cream2">
          {variant === "bammer"
            ? "We've sent a link to confirm your spot. Click it and you're in."
            : "Confirm via the email we just sent and our team will reach out."}
        </p>

        {variant === "bammer" && shareUrl && (
          <div className="mt-6 rounded-xl border border-flame/30 bg-ink2 p-4 text-left">
            <p className="mb-2 text-xs font-medium text-flame">
              earn £5 for every 50 mates who join
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-ink3 px-3 py-2 text-xs text-cream2">
                {shareUrl}
              </code>
              <Button
                type="button"
                onClick={copyShare}
                size="icon"
                className="h-9 w-9 shrink-0 rounded-lg bg-flame hover:bg-flame-soft"
                aria-label="copy your referral link"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  if (variant === "bammer") {
    const e = bammerForm.formState.errors
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {headline && (
          <h3 className="mb-6 text-center text-xl font-bold lowercase text-cream">
            {headline}
          </h3>
        )}
        {referredBy && (
          <p className="mb-4 rounded-lg border border-flame/30 bg-flame/10 px-3 py-2 text-center text-xs text-cream2">
            a mate invited you — nice. you&apos;re both sorted.
          </p>
        )}
        <form onSubmit={bammerForm.handleSubmit(onSubmitBammer)} className="space-y-4">
          <div>
            <Input {...bammerForm.register("name")} placeholder="first name" className={fieldClass} />
            {e.name && <p className="mt-1 text-xs text-error">{e.name.message}</p>}
          </div>

          <div>
            <Input {...bammerForm.register("email")} type="email" placeholder="email" className={fieldClass} />
            {e.email && <p className="mt-1 text-xs text-error">{e.email.message}</p>}
          </div>

          <div>
            <PhoneInput
              accent="flame"
              placeholder="mobile (optional)"
              onChange={(v) => bammerForm.setValue("phone", v)}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-hairline bg-ink3 p-3">
            <Checkbox
              checked={bammerForm.watch("smsOptIn")}
              onCheckedChange={(v) => bammerForm.setValue("smsOptIn", Boolean(v))}
              className="mt-0.5 border-mute data-[state=checked]:bg-flame data-[state=checked]:border-flame"
            />
            <span className="text-xs leading-relaxed text-cream2">
              text me about events &amp; deals near me. reply STOP anytime.
            </span>
          </label>

          <div>
            <span className={labelClass}>what are you mainly after?</span>
            <Select onValueChange={(v) => bammerForm.setValue("vibe", v, { shouldValidate: true })}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="pick a vibe" />
              </SelectTrigger>
              <SelectContent className="border-hairline bg-ink2">
                <SelectItem value="live-music">live music &amp; gigs</SelectItem>
                <SelectItem value="themed-events">themed / bammer-only events</SelectItem>
                <SelectItem value="cheap-drinks">the best drink deals</SelectItem>
                <SelectItem value="big-nights">big nights with mates</SelectItem>
                <SelectItem value="chilled">chilled bars &amp; spots</SelectItem>
              </SelectContent>
            </Select>
            {e.vibe && <p className="mt-1 text-xs text-error">{e.vibe.message}</p>}
          </div>

          <div>
            <span className={labelClass}>how often are you out?</span>
            <Select onValueChange={(v) => bammerForm.setValue("frequency", v, { shouldValidate: true })}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="pick one" />
              </SelectTrigger>
              <SelectContent className="border-hairline bg-ink2">
                <SelectItem value="multiple-week">a few times a week</SelectItem>
                <SelectItem value="weekly">most weekends</SelectItem>
                <SelectItem value="monthly">a couple times a month</SelectItem>
                <SelectItem value="occasionally">now and then</SelectItem>
              </SelectContent>
            </Select>
            {e.frequency && <p className="mt-1 text-xs text-error">{e.frequency.message}</p>}
          </div>

          <div>
            <span className={labelClass}>what would make BamSip a win for you? (optional)</span>
            <Textarea
              {...bammerForm.register("motivation")}
              placeholder="e.g. never miss a good night, save on rounds..."
              className="min-h-[72px] rounded-xl border-hairline bg-ink3 text-cream placeholder:text-mute focus:border-flame focus:ring-flame"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-flame text-base font-semibold text-cream transition-all hover:bg-flame-soft"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                register interest
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-mute">
          First event: Manchester, July. More all summer.
        </p>
      </motion.div>
    )
  }

  // Venue form
  const ve = venueForm.formState.errors
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {headline && (
        <h3 className="mb-6 text-center text-xl font-bold lowercase text-cream">
          {headline}
        </h3>
      )}
      <form onSubmit={venueForm.handleSubmit(onSubmitVenue)} className="space-y-4">
        <div>
          <Input {...venueForm.register("venueName")} placeholder="venue name" className={fieldClass} />
          {ve.venueName && <p className="mt-1 text-xs text-error">{ve.venueName.message}</p>}
        </div>

        <div>
          <Input {...venueForm.register("contactName")} placeholder="your name" className={fieldClass} />
          {ve.contactName && <p className="mt-1 text-xs text-error">{ve.contactName.message}</p>}
        </div>

        <div>
          <span className={labelClass}>your role</span>
          <Select onValueChange={(v) => venueForm.setValue("role", v, { shouldValidate: true })}>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="select your role" />
            </SelectTrigger>
            <SelectContent className="border-hairline bg-ink2">
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="gm">General Manager</SelectItem>
              <SelectItem value="marketing">Marketing / Events</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {ve.role && <p className="mt-1 text-xs text-error">{ve.role.message}</p>}
        </div>

        <div>
          <Input {...venueForm.register("email")} type="email" placeholder="email" className={fieldClass} />
          {ve.email && <p className="mt-1 text-xs text-error">{ve.email.message}</p>}
        </div>

        <div>
          <PhoneInput
            accent="amber"
            placeholder="phone (optional)"
            onChange={(v) => venueForm.setValue("phone", v)}
          />
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-hairline bg-ink3 p-3">
          <Checkbox
            checked={venueForm.watch("smsOptIn")}
            onCheckedChange={(v) => venueForm.setValue("smsOptIn", Boolean(v))}
            className="mt-0.5 border-mute data-[state=checked]:bg-amber data-[state=checked]:border-amber"
          />
          <span className="text-xs leading-relaxed text-cream2">
            ok to text me about onboarding. reply STOP anytime.
          </span>
        </label>

        <div>
          <span className={labelClass}>what kind of venue?</span>
          <Select onValueChange={(v) => venueForm.setValue("venueType", v, { shouldValidate: true })}>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="pick one" />
            </SelectTrigger>
            <SelectContent className="border-hairline bg-ink2">
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="nightclub">Nightclub</SelectItem>
              <SelectItem value="pub">Pub</SelectItem>
              <SelectItem value="live-venue">Live music venue</SelectItem>
              <SelectItem value="restaurant">Restaurant / lounge</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {ve.venueType && <p className="mt-1 text-xs text-error">{ve.venueType.message}</p>}
        </div>

        <div>
          <span className={labelClass}>what do you most want from BamSip?</span>
          <Select onValueChange={(v) => venueForm.setValue("goal", v, { shouldValidate: true })}>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="main goal" />
            </SelectTrigger>
            <SelectContent className="border-hairline bg-ink2">
              <SelectItem value="fill-quiet">fill quiet nights</SelectItem>
              <SelectItem value="new-customers">reach new customers</SelectItem>
              <SelectItem value="host-events">host themed / bammer events</SelectItem>
              <SelectItem value="spend">increase spend per head</SelectItem>
              <SelectItem value="data">understand my customers</SelectItem>
            </SelectContent>
          </Select>
          {ve.goal && <p className="mt-1 text-xs text-error">{ve.goal.message}</p>}
        </div>

        <div>
          <span className={labelClass}>biggest challenge right now? (optional)</span>
          <Textarea
            {...venueForm.register("challenge")}
            placeholder="e.g. midweek footfall, standing out..."
            className={textareaClass}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-amber text-base font-semibold text-ink transition-all hover:bg-amber-soft"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              register interest
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-mute">
        Manchester first, launching July. Now onboarding.
      </p>
    </motion.div>
  )
}

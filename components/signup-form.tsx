"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Loader2, Check } from "lucide-react"

const bammerSchema = z.object({
  email: z.string().email("enter a valid email"),
  mobile: z.string().min(10, "enter a valid mobile number"),
  city: z.string().min(1, "select a city"),
  cityOther: z.string().optional(),
})

const venueSchema = z.object({
  contactName: z.string().min(2, "enter your name"),
  venueName: z.string().min(2, "enter your venue name"),
  role: z.string().min(1, "select your role"),
  roleOther: z.string().optional(),
  email: z.string().email("enter a valid email"),
  phone: z.string().min(10, "enter a valid phone number"),
})

type BammerFormData = z.infer<typeof bammerSchema>
type VenueFormData = z.infer<typeof venueSchema>

interface SignupFormProps {
  variant: "bammer" | "venue"
  headline?: string
}

export function SignupForm({ variant, headline }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCityOther, setShowCityOther] = useState(false)
  const [showRoleOther, setShowRoleOther] = useState(false)

  const bammerForm = useForm<BammerFormData>({
    resolver: zodResolver(bammerSchema),
    defaultValues: {
      email: "",
      mobile: "",
      city: "",
      cityOther: "",
    },
  })

  const venueForm = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      contactName: "",
      venueName: "",
      role: "",
      roleOther: "",
      email: "",
      phone: "",
    },
  })

  const form = variant === "bammer" ? bammerForm : venueForm

  const onSubmitBammer = async (data: BammerFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setIsSuccess(true)
        bammerForm.reset()
      }
    } catch (error) {
      console.error("[v0] Signup error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitVenue = async (data: VenueFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/venue-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setIsSuccess(true)
        venueForm.reset()
      }
    } catch (error) {
      console.error("[v0] Venue interest error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl border border-success/30 bg-success/10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-cream mb-2">
          {variant === "bammer" ? "you're on the list." : "we'll be in touch."}
        </h3>
        <p className="text-cream2 text-sm">
          {variant === "bammer"
            ? "We'll let you know when BamSip launches in your city."
            : "Our team will reach out within 48 hours."}
        </p>
      </motion.div>
    )
  }

  if (variant === "bammer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {headline && (
          <h3 className="text-xl font-bold text-cream mb-6 text-center lowercase">
            {headline}
          </h3>
        )}
        <form
          onSubmit={bammerForm.handleSubmit(onSubmitBammer)}
          className="space-y-4"
        >
          <div>
            <Input
              {...bammerForm.register("email")}
              type="email"
              placeholder="email"
              className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
            />
            {bammerForm.formState.errors.email && (
              <p className="text-error text-xs mt-1">
                {bammerForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...bammerForm.register("mobile")}
              type="tel"
              placeholder="mobile"
              className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
            />
            {bammerForm.formState.errors.mobile && (
              <p className="text-error text-xs mt-1">
                {bammerForm.formState.errors.mobile.message}
              </p>
            )}
          </div>

          <div>
            <Select
              onValueChange={(value) => {
                bammerForm.setValue("city", value)
                setShowCityOther(value === "Other")
              }}
            >
              <SelectTrigger className="bg-ink3 border-hairline text-cream h-12 rounded-xl focus:border-flame focus:ring-flame">
                <SelectValue placeholder="city" />
              </SelectTrigger>
              <SelectContent className="bg-ink2 border-hairline">
                <SelectItem value="Manchester">Manchester</SelectItem>
                <SelectItem value="Leeds">Leeds</SelectItem>
                <SelectItem value="Liverpool">Liverpool</SelectItem>
                <SelectItem value="Birmingham">Birmingham</SelectItem>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {bammerForm.formState.errors.city && (
              <p className="text-error text-xs mt-1">
                {bammerForm.formState.errors.city.message}
              </p>
            )}
          </div>

          {showCityOther && (
            <div>
              <Input
                {...bammerForm.register("cityOther")}
                type="text"
                placeholder="your city"
                className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-flame hover:bg-flame-soft text-cream font-semibold text-base transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                get early access
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        <p className="text-mute text-xs text-center mt-4">
          Launching Manchester, May 2026. Other cities to follow.
        </p>
      </motion.div>
    )
  }

  // Venue form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {headline && (
        <h3 className="text-xl font-bold text-cream mb-6 text-center lowercase">
          {headline}
        </h3>
      )}
      <form
        onSubmit={venueForm.handleSubmit(onSubmitVenue)}
        className="space-y-4"
      >
        <div>
          <Input
            {...venueForm.register("contactName")}
            type="text"
            placeholder="your name"
            className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
          />
          {venueForm.formState.errors.contactName && (
            <p className="text-error text-xs mt-1">
              {venueForm.formState.errors.contactName.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...venueForm.register("venueName")}
            type="text"
            placeholder="venue name"
            className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
          />
          {venueForm.formState.errors.venueName && (
            <p className="text-error text-xs mt-1">
              {venueForm.formState.errors.venueName.message}
            </p>
          )}
        </div>

        <div>
          <Select
            onValueChange={(value) => {
              venueForm.setValue("role", value)
              setShowRoleOther(value === "Other")
            }}
          >
            <SelectTrigger className="bg-ink3 border-hairline text-cream h-12 rounded-xl focus:border-flame focus:ring-flame">
              <SelectValue placeholder="your role" />
            </SelectTrigger>
            <SelectContent className="bg-ink2 border-hairline">
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="GM">General Manager</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {venueForm.formState.errors.role && (
            <p className="text-error text-xs mt-1">
              {venueForm.formState.errors.role.message}
            </p>
          )}
        </div>

        {showRoleOther && (
          <div>
            <Input
              {...venueForm.register("roleOther")}
              type="text"
              placeholder="your role"
              className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
            />
          </div>
        )}

        <div>
          <Input
            {...venueForm.register("email")}
            type="email"
            placeholder="email"
            className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
          />
          {venueForm.formState.errors.email && (
            <p className="text-error text-xs mt-1">
              {venueForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...venueForm.register("phone")}
            type="tel"
            placeholder="phone"
            className="bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl focus:border-flame focus:ring-flame"
          />
          {venueForm.formState.errors.phone && (
            <p className="text-error text-xs mt-1">
              {venueForm.formState.errors.phone.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-flame hover:bg-flame-soft text-cream font-semibold text-base transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              register interest
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
      <p className="text-mute text-xs text-center mt-4">
        Manchester first. Now onboarding.
      </p>
    </motion.div>
  )
}

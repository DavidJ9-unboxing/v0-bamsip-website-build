"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** Curated list of dial codes — UK first so it's the default. */
const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ZA", name: "South Africa", dial: "+27" },
]

const DEFAULT_CODE = "GB"

interface PhoneInputProps {
  /** Called with the full E.164 value (e.g. +447400123456) or "" when empty. */
  onChange: (value: string) => void
  accent?: "flame" | "amber"
  placeholder?: string
  className?: string
}

export function PhoneInput({
  onChange,
  accent = "flame",
  placeholder = "mobile (optional)",
  className,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState(DEFAULT_CODE)
  const [national, setNational] = useState("")

  const focusClass =
    accent === "amber"
      ? "focus:border-amber focus:ring-amber"
      : "focus:border-flame focus:ring-flame"
  const fieldBase = `bg-ink3 border-hairline text-cream placeholder:text-mute h-12 rounded-xl ${focusClass}`

  // Index by a unique key (code) so duplicate dial codes like +1 don't clash.
  const selected = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0],
    [countryCode],
  )

  const emit = (code: string, num: string) => {
    const country = COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]
    // Keep digits only, drop a single leading 0 (common UK/EU national prefix).
    const digits = num.replace(/\D/g, "").replace(/^0+/, "")
    onChange(digits ? `${country.dial}${digits}` : "")
  }

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <Select
        value={countryCode}
        onValueChange={(v) => {
          setCountryCode(v)
          emit(v, national)
        }}
      >
        <SelectTrigger
          aria-label="country dialling code"
          className={`${fieldBase} w-[7.5rem] shrink-0`}
        >
          <SelectValue>{selected.dial}</SelectValue>
        </SelectTrigger>
        <SelectContent className="border-hairline bg-ink2">
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              <span className="text-cream2">{c.dial}</span>{" "}
              <span className="text-mute">{c.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={national}
        onChange={(e) => {
          setNational(e.target.value)
          emit(countryCode, e.target.value)
        }}
        className={`${fieldBase} flex-1`}
      />
    </div>
  )
}

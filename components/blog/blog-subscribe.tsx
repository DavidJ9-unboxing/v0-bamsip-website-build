import Link from "next/link"
import { Mail, MessageSquare, Music2, Instagram, ArrowRight } from "lucide-react"

const channels = [
  { icon: Mail, label: "Email" },
  { icon: MessageSquare, label: "SMS" },
  { icon: Music2, label: "TikTok" },
  { icon: Instagram, label: "Instagram" },
]

export function BlogSubscribe() {
  return (
    <section className="mt-16 overflow-hidden rounded-3xl border border-hairline bg-ink2 p-8 text-center sm:p-12">
      <h2 className="text-balance font-display text-2xl font-bold text-cream sm:text-3xl">
        Never miss a night out
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-cream2">
        We push the best of Manchester after dark across every channel you
        actually use. Join the list and pick how you want to hear from us.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {channels.map((c) => (
          <span
            key={c.label}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ink3 px-3.5 py-1.5 text-sm text-cream2"
          >
            <c.icon className="h-4 w-4 text-flame" />
            {c.label}
          </span>
        ))}
      </div>

      <Link
        href="/#waitlist"
        className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-flame px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-flame-soft"
      >
        Join the list
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

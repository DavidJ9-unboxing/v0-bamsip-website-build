import Link from "next/link"
import { confirmSignup } from "@/app/actions/signups"
import { Check, X } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; token?: string }>
}) {
  const { type, token } = await searchParams
  const kind = type === "venue" ? "venue" : "bammer"
  const result =
    token && (type === "bammer" || type === "venue")
      ? await confirmSignup(kind, token)
      : { ok: false }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-hairline bg-ink2 p-8 text-center">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            result.ok ? "bg-success/20" : "bg-error/20"
          }`}
        >
          {result.ok ? (
            <Check className="h-8 w-8 text-success" />
          ) : (
            <X className="h-8 w-8 text-error" />
          )}
        </div>

        {result.ok ? (
          <>
            <h1 className="mb-2 font-display text-2xl font-bold lowercase text-cream">
              {kind === "bammer"
                ? `you're in${result.name ? `, ${result.name}` : ""}!`
                : "interest confirmed!"}
            </h1>
            <p className="text-sm leading-relaxed text-cream2">
              {kind === "bammer"
                ? "You're on the BamSip list. Check your inbox for your referral link — earn £5 for every 50 mates who join."
                : "Thanks for confirming. Our team will be in touch about getting your venue on board."}
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-2 font-display text-2xl font-bold lowercase text-cream">
              link expired or invalid
            </h1>
            <p className="text-sm leading-relaxed text-cream2">
              This confirmation link isn&apos;t valid anymore. Head back and
              register again to get a fresh link.
            </p>
          </>
        )}

        <Link
          href="/bammers"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-flame px-6 py-3 text-sm font-semibold text-cream transition-all hover:bg-flame-soft"
        >
          back to BamSip
        </Link>
      </div>
    </main>
  )
}

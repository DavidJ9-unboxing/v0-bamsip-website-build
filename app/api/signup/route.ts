import { NextResponse } from "next/server"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  mobile: z.string().min(10),
  city: z.enum([
    "Manchester",
    "Leeds",
    "Liverpool",
    "Birmingham",
    "London",
    "Other",
  ]),
  cityOther: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = signupSchema.parse(body)

    // Get UTM source from headers if present
    const referer = request.headers.get("referer") || ""
    const url = new URL(referer || "https://bamsip.com")
    const source = url.searchParams.get("utm_source") || undefined

    // TODO: Store in database (Supabase/Vercel Postgres)
    // For now, log the signup
    console.log("[v0] New Bammer signup:", {
      ...data,
      source,
      createdAt: new Date().toISOString(),
    })

    // TODO: Send confirmation email via Resend
    // await resend.emails.send({
    //   from: 'BamSip <hello@bamsip.com>',
    //   to: data.email,
    //   subject: "you're on the list.",
    //   html: `...`
    // })

    return NextResponse.json(
      { success: true, message: "Signup successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}

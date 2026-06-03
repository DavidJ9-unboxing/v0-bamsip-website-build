import { NextResponse } from "next/server"
import { z } from "zod"

const venueInterestSchema = z.object({
  contactName: z.string().min(2),
  venueName: z.string().min(2),
  role: z.enum(["Owner", "GM", "Marketing", "Other"]),
  roleOther: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = venueInterestSchema.parse(body)

    // TODO: Store in database (Supabase/Vercel Postgres)
    // For now, log the venue interest
    console.log("[v0] New venue interest:", {
      ...data,
      createdAt: new Date().toISOString(),
    })

    // TODO: Send confirmation email to venue via Resend
    // await resend.emails.send({
    //   from: 'BamSip <hello@bamsip.com>',
    //   to: data.email,
    //   subject: "we'll be in touch — BamSip",
    //   html: `...`
    // })

    // TODO: Send notification to natan@bamsip.com
    // await resend.emails.send({
    //   from: 'BamSip <notifications@bamsip.com>',
    //   to: 'natan@bamsip.com',
    //   subject: `New venue interest: ${data.venueName}`,
    //   html: `...`
    // })

    return NextResponse.json(
      { success: true, message: "Interest registered" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Venue interest error:", error)

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

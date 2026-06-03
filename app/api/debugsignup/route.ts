import { NextResponse } from "next/server"
import { registerBammer } from "@/app/actions/signups"

export async function GET() {
  try {
    const res = await registerBammer({
      name: "Curl Debug",
      email: `curl_${Date.now()}@example.com`,
      phone: "07700900333",
      smsOptIn: true,
      vibe: "themed",
      frequency: "weekends",
      motivation: "debug",
    })
    return NextResponse.json({ res })
  } catch (e) {
    return NextResponse.json(
      { thrown: (e as Error)?.message, stack: (e as Error)?.stack },
      { status: 500 },
    )
  }
}

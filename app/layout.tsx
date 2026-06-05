import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bamsip.com"

export const metadata: Metadata = {
  title: "BamSip — Smarter nights out.",
  description:
    "Manchester's nightlife app for pre-bought drinks, live deals, venue discovery, and smarter nights out.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "BamSip — Smarter nights out.",
    description:
      "Manchester's nightlife app for pre-bought drinks, live deals, venue discovery, and smarter nights out.",
    url: SITE_URL,
    siteName: "BamSip",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BamSip — Smarter nights out.",
    description:
      "Manchester's nightlife app for pre-bought drinks, live deals, venue discovery, and smarter nights out.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} bg-ink`}
    >
      <body className="font-sans antialiased min-h-screen bg-ink text-cream">
        {children}
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

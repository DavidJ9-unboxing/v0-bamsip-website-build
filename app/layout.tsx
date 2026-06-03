import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BamSip — One app, two sides. Both get paid.",
  description:
    "Manchester's new nightlife marketplace. Pre-buy drinks, fill dead nights.",
  metadataBase: new URL("https://bamsip.com"),
  openGraph: {
    title: "BamSip — One app, two sides. Both get paid.",
    description:
      "Manchester's new nightlife marketplace. Pre-buy drinks, fill dead nights.",
    url: "https://bamsip.com",
    siteName: "BamSip",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BamSip — One app, two sides. Both get paid.",
    description:
      "Manchester's new nightlife marketplace. Pre-buy drinks, fill dead nights.",
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
    <html lang="en" className={`${inter.variable} bg-ink`}>
      <body className="font-sans antialiased min-h-screen bg-ink text-cream">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

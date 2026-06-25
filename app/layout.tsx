import type { Metadata, Viewport } from "next"
import { Nunito, DM_Mono } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

export const metadata: Metadata = {
  title: "PathAI — Nigerian Career Navigator",
  description: "The AI career mentor for first-generation Nigerians. A personal roadmap built on free local resources, plus live interview practice with real Nigerian companies.",
  metadataBase: new URL("https://pathai.vercel.app"),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#15994A",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`h-full ${nunito.variable} ${dmMono.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}

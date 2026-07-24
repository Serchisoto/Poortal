import type { Metadata, Viewport } from "next"
import { Nunito, Cormorant_Garamond } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "POORTAL – Concierge Digital",
    template: "%s | POORTAL",
  },
  description:
    "Descubre y reserva las mejores experiencias turísticas. Tours, actividades, restaurantes y más en un solo lugar.",
  keywords: ["turismo", "tours", "experiencias", "reservas", "Cancún", "México"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "POORTAL",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "POORTAL",
    title: "POORTAL – Concierge Digital",
    description: "Tu concierge digital para destinos turísticos.",
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#1e1a14' },
  ],
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/poortal-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${nunito.variable} ${cormorant.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

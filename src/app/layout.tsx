import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "POORTAL - Concierge Digital para Destinos Turisticos",
    template: "%s | POORTAL",
  },
  description:
    "Descubre y reserva las mejores experiencias turisticas. Tours, actividades, restaurantes y mas en un solo lugar.",
  keywords: ["turismo", "tours", "experiencias", "reservas", "Cancun", "Mexico"],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${nunito.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}

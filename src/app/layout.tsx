import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "../lib/auth-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Klikeo — Comercio local en Colombia",
  description:
    "Encuentra y contacta negocios locales en Colombia con chatbot de WhatsApp 24/7",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next";
import { Zilla_Slab, IBM_Plex_Mono, Inter } from "next/font/google";
import { AuthProvider } from "../lib/auth-context";
import "./globals.css";
import BackgroundEffects from "../components/BackgroundEffects";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const zilla = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-zilla",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Klikeo — Comercio local en Colombia",
  description:
    "Encuentra y contacta negocios locales en Colombia con chatbot de WhatsApp 24/7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${zilla.variable} ${plexMono.variable} font-sans`}>
        <AuthProvider>
          <BackgroundEffects />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
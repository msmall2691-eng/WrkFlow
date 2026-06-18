import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Canonical/OG base. Using the live Vercel URL until the brand domain
// (connectivestudio.co) is wired up — then swap this single constant.
const SITE_URL = "https://wrk-flow.vercel.app";
const DESCRIPTION =
  "Connective Studio designs and builds custom websites, workflow automations, and the systems behind them—and optimizes the processes you already run—so your business operates faster, cleaner, and with less manual work.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Connective Studio — Websites, automation & systems",
    template: "%s · Connective Studio",
  },
  description: DESCRIPTION,
  keywords: [
    "web design and development",
    "workflow automation",
    "process optimization",
    "systems integration",
    "custom software",
    "AI agents",
    "business systems",
  ],
  authors: [{ name: "Connective Studio" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Connective Studio",
    title: "Connective Studio — Websites, automation & systems",
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Connective Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connective Studio — Websites, automation & systems",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

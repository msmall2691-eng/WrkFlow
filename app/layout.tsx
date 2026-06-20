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

// Canonical/OG base — the live brand domain.
const SITE_URL = "https://mlinx.studio";
const DESCRIPTION =
  "M Studio builds custom websites, workflow automations, and the systems behind them—and tightens the processes you already run—so your business runs faster and cleaner, with less manual work. Maine-built, working with clients anywhere.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "M Studio — Websites, automation & systems",
    template: "%s · M Studio",
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
    "Maine web design",
  ],
  authors: [{ name: "M Studio" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "M Studio",
    title: "M Studio — Websites, automation & systems",
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "M Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M Studio — Websites, automation & systems",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1722",
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

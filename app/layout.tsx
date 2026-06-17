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
// (e.g. wrkflow.studio) is purchased — then swap this single constant.
const SITE_URL = "https://wrk-flow.vercel.app";
const DESCRIPTION =
  "WRKFLOW builds custom operations software—CRMs, databases, dashboards, automations, and AI agents—so businesses own their systems instead of renting them.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WRKFLOW — Own your operations",
    template: "%s · WRKFLOW",
  },
  description: DESCRIPTION,
  keywords: [
    "custom CRM",
    "operations software",
    "workflow automation",
    "AI agents",
    "legacy software migration",
    "business systems",
    "operational dashboards",
  ],
  authors: [{ name: "WRKFLOW" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "WRKFLOW",
    title: "WRKFLOW — Own your operations",
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WRKFLOW",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WRKFLOW — Own your operations",
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

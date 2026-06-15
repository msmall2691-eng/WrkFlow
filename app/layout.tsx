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

const SITE_URL = "https://workflow-studio.com";
const DESCRIPTION =
  "Workflow Studio builds custom operations software—CRMs, databases, dashboards, automations, and AI agents—so businesses own their systems instead of renting them.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Workflow Studio — Own your operations",
    template: "%s · Workflow Studio",
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
  authors: [{ name: "Workflow Studio" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Workflow Studio",
    title: "Workflow Studio — Own your operations",
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Workflow Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workflow Studio — Own your operations",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
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

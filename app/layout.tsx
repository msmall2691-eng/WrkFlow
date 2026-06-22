import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import KonamiEgg from "@/components/KonamiEgg";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

// Editorial serif — used to give the Services section its own distinct voice.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
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
  "Websites, apps, and the systems behind them — designed around how you actually work, then handed over, yours to keep. Built on the Maine coast.";

const TITLE = "M Studio — Web & Software Studio, Maine Coast";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
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
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "M Studio — custom websites & software, Maine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
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

/*
  Structured data — feeds rich results + AI answer engines. The legal entity is
  M Studio (M Linx is the product line, not a co-equal brand), founded by Meg.
*/
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "M Studio",
      publisher: { "@id": `${SITE_URL}/#studio` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#studio`,
      name: "M Studio",
      url: SITE_URL,
      email: "contact@mlinx.studio",
      telephone: "+1-207-432-9492",
      description:
        "Custom websites, apps, tools, and workflows for businesses and personal projects, built to own, not rent. Founded by an operator who ran the business first.",
      slogan: "Everything, linked.",
      knowsAbout: [
        "Custom software development",
        "Web design and development",
        "Web applications",
        "Systems integration",
        "Data modeling",
        "Workflow automation",
        "Business analytics",
        "Artificial intelligence",
      ],
      areaServed: [
        { "@type": "State", name: "Maine" },
        { "@type": "Place", name: "New England" },
        { "@type": "Place", name: "Worldwide (remote)" },
      ],
      founder: { "@id": `${SITE_URL}/#meg` },
      address: {
        "@type": "PostalAddress",
        addressRegion: "ME",
        addressCountry: "US",
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#meg`,
      name: "Meg",
      jobTitle: "Founder & Software Developer",
      worksFor: { "@id": `${SITE_URL}/#studio` },
      description:
        "Operator-turned-builder. Ran The Maine Cleaning Company, then learned to build the software it needed, now building owned systems for all kinds of businesses and personal projects.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Southern Maine",
      },
      knowsAbout: [
        "Business Analytics",
        "Artificial Intelligence",
        "Computer Science",
        "Backend development",
        "Data modeling",
        "Systems integration",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* No-JS safety: never leave scroll-reveal content hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <ScrollProgress />
        {children}
        <BackToTop />
        <ConsoleGreeting />
        <KonamiEgg />
      </body>
    </html>
  );
}

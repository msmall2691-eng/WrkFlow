import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import KonamiEgg from "@/components/KonamiEgg";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
  "M Studio designs and builds custom websites, web apps, tools, and plugins—and helps connect the ones you already use. For businesses and one-off projects alike. Built on the coast of Maine, working with clients anywhere.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "M Studio | M Linx Studio — Custom websites, tools & plugins",
    template: "%s · M Studio | M Linx Studio",
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
    siteName: "M Studio | M Linx Studio",
    title: "M Studio | M Linx Studio — Custom websites, tools & plugins",
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "M Studio | M Linx Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M Studio | M Linx Studio — Custom websites, tools & plugins",
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
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#studio`,
      name: "M Studio",
      url: SITE_URL,
      description:
        "Custom websites, web apps, and tools for small businesses—built to own, not rent. Founded by an operator who ran the business first.",
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
        "Operator-turned-builder. Ran The Maine Cleaning Company, then learned to build the software it needed—now building owned systems from scratch for other small businesses.",
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
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

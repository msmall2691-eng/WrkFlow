import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import RegisterSW from "@/components/RegisterSW";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getFog } from "@/lib/fog";
import { siteGraph, SITE_URL } from "@/lib/schema";

/*
  The five typefaces, from files in this repo rather than from Google.

  **These were `next/font/google`, and that put a network call in the
  build.** `next/font` fetches each family from Google at build time and
  self-hosts the result, so every CI run and every Vercel deploy needed
  fonts.googleapis.com to answer. On Nov 27 2026 it did not, twice inside
  half an hour: #166 and #167 both died at `An error occurred in
  next/font` → `Build failed because of webpack errors`, on two unrelated
  diffs, while a third PR built fine hours later. Nothing was wrong with
  either change. A build that cannot run without a third party answering
  is a deploy that cannot run without them either, and this site deploys
  on merge.

  **The files are Next's own output, not a fresh download**, which is why
  the rendering is unchanged rather than merely similar: each one is the
  exact latin subset `next/font/google` had already produced and served,
  lifted out of `.next/static/media`. All five are variable fonts, so one
  file covers every weight the site uses, and the weight ranges below are
  the ones Google declared for them.

  Inter Tight was four `@font-face` declarations (400/500/600/700)
  pointing at a single file, because it is one variable font and the
  weights were a request rather than four downloads. It is declared once
  here, over its whole range.

  Only the latin subset is kept. The Google version also shipped Cyrillic,
  Greek and Vietnamese ranges that this site has no text in, and
  `subsets: ["latin"]` was already saying so.

  Replacing a file means replacing it with the same subset of the same
  family, or the fallback metrics below stop matching and text reflows as
  the face swaps in.
*/
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-space-grotesk",
  display: "swap",
  adjustFontFallback: "Arial",
});

/*
  Three families: Space Grotesk for UI, Inter for body, Fraunces for the
  editorial headings, plus JetBrains Mono for genuine data.

  Fraunces was briefly dropped when this page loaded five families, on the
  roadmap's "pick two" line. Meg wants it kept, which is also what CLAUDE.md
  says about the site's typefaces, so it is back on exactly the headings it
  had before. Caveat stayed retired: it existed for one signature, which is
  now set as a plain sign-off.

  Its `opsz` axis survives the move: the file is the variable one Google
  served, so the optical size axis is still in it.
*/
const fraunces = localFont({
  src: "./fonts/fraunces-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-jetbrains-mono",
  display: "swap",
  adjustFontFallback: "Arial",
});

/*
  Inter Tight — the approved homepage design's display and body face. It is
  loaded here because fonts are a document-level concern, and used only
  inside `.stage` (see the block at the foot of globals.css), so the rest
  of the site keeps the faces it already shipped with and the page-title
  test keeps its one answer.

  The design uses 400 for body, 500 for buttons and prices and 600 for
  every heading; one variable file carries all of them.
*/
const interTight = localFont({
  src: "./fonts/inter-tight-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter-tight",
  display: "swap",
  adjustFontFallback: "Arial",
});

const DESCRIPTION =
  "Websites, custom CRMs, platform setup, data migration and integrations for small businesses. Improve the tools you use or build what is missing. Based in Maine, clients anywhere.";

const TITLE = "M Studio — Websites, Software & Integrations";

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
    "CRM setup",
    "data migration",
    "platform setup",
    "Maine web design",
  ],
  authors: [{ name: "M Studio" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "M Studio",
    title: TITLE,
    description: DESCRIPTION,
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
  /* Harbor's ground. This paints the browser's own chrome on a phone, so
     a cream bar over a near-black page is the theme flip showing up in the
     one place CSS cannot reach. */
  themeColor: "#08070c",
  width: "device-width",
  initialScale: 1,
};

/*
  Structured data now lives in lib/schema.ts, which builds it from
  lib/content.ts: the site, the studio, Meg as a named person, and a
  CreativeWork for every case study, all cross-referenced by `@id`. It moved
  out of this file when it stopped being one object and became a graph two
  routes contribute to.
*/
const JSON_LD = siteGraph();

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Server-side fog check — Next's fetch cache dedupes this with /api/maine's
  // same NWS call, so no extra round-trip. Renders `data-fog="1"` on <html>
  // at SSR so the veil is present on first paint; absent when NWS is down.
  const fog = await getFog();
  // CSP nonce, minted per-request by middleware.ts — required on every
  // inline <script> we write ourselves now that script-src no longer allows
  // 'unsafe-inline'.
  const hdrs = await headers();
  const nonce = hdrs.get("x-nonce") ?? undefined;
  /*
    Per-route default theme. Middleware sends "dark" for everything now —
    Harbor is the default the site ships. A visitor's own stored choice
    still wins over this; see the pre-paint script below.
  */
  const themeDefault = hdrs.get("x-theme-default") === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      data-fog={fog ? "1" : undefined}
      className={`${spaceGrotesk.variable} ${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <body>
        {/*
          Flash-prevention: pull the stored theme (if any) before first paint.
          Runs synchronously in <body>, so the class is on <html> before
          styles apply. suppressHydrationWarning on both scripts below:
          browsers redact the `nonce` attribute's value from the DOM right
          after applying it (so a compromised script can't read/exfiltrate
          it), so the client will always see nonce="" here even though the
          real nonce was correctly validated against the CSP header before
          that redaction happened — a false-positive mismatch, not a bug.
        */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              /*
                 Harbor unless the visitor asked for Daylight. Only an
                 explicit stored 'light' sets the attribute; everything else —
                 no value, the legacy 'auto', a corrupt value, or localStorage
                 throwing in a locked-down browser — lands on dark, which is
                 what the site now ships. The test is on the value we want
                 rather than on the one we don't, so a corrupt entry falls to
                 the default instead of to whatever the other branch was.
                 themeAuto records the route default so the appearance control
                 knows what "reset" means.
              */
              /*
                 `js` is set here rather than in a component, and the
                 watchdog beside it is what makes the scroll reveals
                 safe. Setting the attribute alone covered a visitor
                 with JavaScript off, and missed the worse case: the
                 script runs, the attribute is set, and then the React
                 chunk never arrives — blocked, dropped, or failing to
                 hydrate. Nothing would then ever set `data-revealed`,
                 and the shop, the work and the contact section would be
                 permanently invisible with their HTML sitting right
                 there in the document.

                 So the hidden state expires. `Reveal` marks the root
                 `data-reveal-ready` the moment one of them mounts; if
                 that has not happened in four seconds, this removes
                 `data-js` and every reveal becomes visible. It fails
                 open, which is the only acceptable direction: a section
                 that appears without animating is a small loss, and a
                 section nobody can read is the page broken.

                 A slow connection hitting the timeout gets the same
                 fail-open, which is correct rather than unfortunate. They work by hiding a
                 section until an IntersectionObserver reveals it, so the
                 hidden state must never apply when no script will arrive
                 to undo it: with JavaScript off, or blocked, or still
                 downloading, every revealed section would be a permanent
                 blank. Gating the hidden state on this attribute means the
                 page without script is the page fully visible, and the
                 attribute is set before first paint so there is no flash
                 of content that then hides itself.
              */
              `document.documentElement.dataset.js='';setTimeout(function(){var r=document.documentElement;if(!r.hasAttribute('data-reveal-ready'))r.removeAttribute('data-js');},4000);var d='${themeDefault}';document.documentElement.dataset.themeAuto=d;var t=null;try{t=localStorage.getItem('theme');}catch(e){}if(t==='light')document.documentElement.dataset.theme='light';`,
          }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* No-JS safety: never leave scroll-reveal content hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {/*
          Gone from here: ScrollProgress (a fixed bar that re-rendered React
          on every scroll event, site-wide, to report what the browser's own
          scrollbar already says), KonamiEgg (a keydown listener always live
          on every page for an easter egg no buyer will ever find) and
          ConsoleGreeting (a client-component boundary for a console.log).
        */}
        {/*
          The 3D stage, behind every page.

          Site-wide rather than per-page on purpose: one space the content
          moves through reads as a place, where a scene per section reads
          as effects bolted onto a page. It is `fixed` and `-z-10`, takes
          no pointer events, and renders nothing at all until the client
          has confirmed WebGL, so a page is complete without it.
        */}
        {children}
        <BackToTop />
        <RegisterSW />
        {/*
          Web Analytics (pageviews + the four tracked events in lib/track.ts)
          and Speed Insights (real-visitor Core Web Vitals).

          Both inject their beacon from `document.createElement` inside the
          client bundle rather than as a tag we render, so neither takes a
          `nonce` prop. Under this site's `script-src … 'strict-dynamic'`
          that is fine, and only because of it: 'strict-dynamic' makes the
          browser ignore `'self'`, so a same-origin src is not what permits
          these — inheriting trust from the nonce-allowed bundle that
          appends them is. An e2e test asserts both load without a CSP
          violation, because the failure mode here is silence: a blocked
          beacon collects nothing and reports nothing, which is how this
          site ran with analytics code and no analytics data.

          The code is only half of it. Each needs enabling on the Vercel
          project too, or these components post to a 404.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}


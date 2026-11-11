import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";

/*
  Services and pricing, on their own page.

  Both used to sit on the homepage, which made the first thing a visitor read
  about the work "custom builds from $1,500 · Care Plan $49/mo". That is the
  right opening for someone shopping for a website and the wrong one for
  anybody assessing the work itself, and the homepage cannot lead with both.

  So the homepage is the portfolio and this is the page for a client who
  wants scope and a number. Nothing was cut: the five service rows, the
  custom-build and Care Plan tiers, the smaller fixed-scope projects and the
  FAQ all moved here intact, and every pricing link on the site lands here.

  ───────────────────────────────────────────────────────────────────────────
  V2 pass.

  This page is one of the three the V2 header points at, so until now a
  visitor left the near-black panel on the homepage and landed somewhere
  that looked like a different site. That is most of what "it feels not well
  done" was pointing at.

  The conversion is a wrapper, not a rewrite, because `.cp` redefines the old
  token names inside its own scope: --color-base, --color-ink, --color-muted,
  --color-line and --section-alt-bg all take V2 values there. So Services,
  Pricing and Contact adopt the V2 palette without being touched, and their
  own markup stays the single source for this content.

  Two things the wrapper has to do itself:

    · <Nav> is `fixed`, which is what the old `pt-16` on <main> was clearing.
      PanelHeader sits in flow, so the padding goes with it. Leaving it would
      have opened a 4rem gap above the hero.

    · The accent classes needed globals.css to stop the per-theme rules
      leaking in here. Wrapped in `.cp` before that fix, this page rendered
      32 .text-signal nodes at 3.03:1 and 2 .text-gold at 2.73:1, because the
      Daylight branch hardcodes a colour tuned for cream and `.cp` is
      near-black whatever the theme. That is why the fix landed first.
*/
export const metadata: Metadata = pageMeta({
  title: "Services & pricing",
  description:
    "Websites, CRM setup, data migration, integrations and custom business tools for small businesses. Scope and price agreed before work begins.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader current="/services" />
        </div>

        <main className="relative z-10">
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              {/*
                Still `display-serif` (Fraunces), not the panel's Space Grotesk.

                The V2 pages so far use font-display for every heading and no
                Fraunces at all, so matching them was the obvious move. It is
                the wrong one here. Every section heading below this comes from
                Services, Pricing and Contact and is set in Fraunces, so a
                Space Grotesk h1 put two display faces on one page: more like
                the homepage, less like itself.

                Fraunces is also not incidental. app/layout.tsx records that it
                was dropped once and put back because Meg asked for it kept,
                and CLAUDE.md asks inner pages to be built in the `.cp` palette
                and tokens, which is about colour, not typeface.

                So the palette converts and the typography does not. Whether
                V2 retires Fraunces on converted pages is Meg's call about her
                own brand, and it should be made once for the whole site
                rather than page by page.
              */}
              <h1 className="display-serif m-0 max-w-3xl text-balance text-[2rem] text-[color:var(--cp-ink)] sm:text-4xl md:text-5xl">
                What I build, and what it costs.
              </h1>
              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
                Start with one useful improvement or a full custom build. I agree
                the scope and price with you before work begins.
              </p>
            </div>
          </section>
          <Services />
          <Pricing />
          <Contact />
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}

import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import ForRentals from "@/components/ForRentals";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";
import StackedHeading from "@/components/StackedHeading";

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
                Still Fraunces, not the panel's Space Grotesk, and the
                argument is unchanged: every section heading below this comes
                from Services, Pricing and Contact and is set in Fraunces, so
                a Space Grotesk h1 would put two display faces on one page.
                More like the homepage, less like itself.

                Fraunces is also not incidental. app/layout.tsx records that it
                was dropped once and put back because Meg asked for it kept,
                and CLAUDE.md asks inner pages to be built in the `.cp` palette
                and tokens, which is about colour, not typeface.

                So the palette converts and the typeface does not. Whether V2
                retires Fraunces is Meg's call about her own brand, to be made
                once for the whole site rather than page by page.

                **Nov 24 2026: the size, weight, tracking and step-back now
                come from StackedHeading, and only the face is still decided
                here.** Measured, this h1 was 48px at weight 500 in Fraunces
                while /catalog's was 36px at 600 and the homepage's sections
                were 72px at 400: one element, eight authors. Unifying that
                is a scale fix and it deliberately stops short of the typeface
                question above, which is why `face` is a prop rather than an
                assumption. Flipping this page to Space Grotesk is now one
                word, whenever that decision is actually made.
              */}
              <StackedHeading
                as="h1"
                face="serif"
                lead="What gets built,"
                trail="and what it costs."
              />
              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
                Start with one useful improvement or a full custom build. Scope and
                price are agreed with you before any work begins.
              </p>
            </div>
          </section>
          <Services />
          <ForRentals />
          <Pricing />
          <Contact />
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}

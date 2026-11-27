import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Playground from "@/components/Playground";
import StackedHeading from "@/components/StackedHeading";
import LivingFrame from "@/components/ocean/LivingFrame";
import { siteNav } from "@/lib/content";

/*
  /tools — the free M Linx tools, on their own page.

  They used to sit at position 2 on the homepage, which was a deliberate call
  at the time: they are the site's strongest hook and Meg uses them herself.
  What that decision did not anticipate is how much they weigh. Eight tools,
  each with its own form, on the page a first-time visitor lands on, directly
  under the pitch — the homepage read as a toolbox rather than a studio.

  Here they get room and the homepage gets quiet. Everything that pointed at
  /#tools points here instead, and the nav carries a Tools link, so the hook
  is one click away rather than three screens down.

  Nov 26 2026: converted to the approved homepage's clothes with
  `.cp-inner` — its bar, its two faces, its one accent, no aurora. A token
  re-point, so Playground and its eight tools are untouched; what changes
  for them is that the signal they are drawn in is the homepage's teal and
  that a filled button is the homepage's paper pill rather than a coloured
  one, both decided in `globals.css` rather than here.
*/

export const metadata: Metadata = pageMeta({
  title: "Free tools · quotes, invoices, QR codes and more",
  description:
    "Free tools for service businesses: instant quotes, invoices, email signatures, digital cards, QR codes, tracked links and a website health check. No signup.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="cp cp-inner">
      <div className="relative overflow-hidden">
        <StageTopBar
          inFlow
          cta="book"
          nav={siteNav}
          here="Free tools"
          bookHref="/?offer=call#contact"
        />

        {/* No pt-16: that cleared the fixed <Nav>, and this bar is in flow. */}
        <main className="relative z-10">
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            {/*
              **This page had no picture at all** — measured, two screens and
              zero images, the shortest page on the site and the one selling
              the strongest reason a stranger ever lands here. The heading sat
              alone against about 700px of empty right-hand column at 1440.

              It gets the surface rather than a creature. No frame is
              captioned any more, here or anywhere: the caption carried the
              reef analogy and went with it on Nov 25 2026. This is the
              water the hero dives into, used as the world the site is set
              in, claiming nothing.

              `priority` is on because it is genuinely the first image on the
              page and nothing else competes with it here, which is exactly
              the narrow case the default is off for.
            */}
            <div className="mx-auto max-w-6xl px-6">
              <div className="min-w-0 max-w-3xl">
                {/*
                  `display` (Space Grotesk), not `display-serif`, and left alone:
                  this heading already used the panel's face, so unlike /services
                  there is nothing to decide here.
                */}
                <StackedHeading as="h1" lead="Free tools." trail="No signup." />
                <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                  {/* This read "we build", then "I build". Both are out: the
                      Nov 14 rule dropped "I" as well, so the sentence is about
                      the tools and the reader rather than the maker. A
                      screenshot caught it, not a grep, because the prose wraps
                      across two JSX lines. */}
                  The same tools that go into client systems. Use them here,
                  free, for as long as you like.
                </p>
              </div>

              {/*
                The moorings, and the reasoning above still holds: the
                homepage opens on the dive's own surface, so reusing that
                frame here made two pages look like one, and a working
                waterfront of ropes and pilings is the nearest thing in the
                set to Southern Maine and to free tools simply tied up and
                available.

                **What changed is that the moorings move now, and that they
                are the full width.** Both are measurements rather than
                taste.

                The still was the problem Meg named out loud when she asked
                for no sharp edges, everything living in the background:
                `moorings.webp` reads luma 50.6 at its border against 109.9
                in the middle, which is the brightest border of any art on
                this site. There is nothing for a mask to dissolve, so it
                rendered as a lit rectangle on a near-black page, which is
                the one thing that rule forbids.

                And the column was the wrong shape for her clip. Her
                `4k-dive-header` is 1920x840, 2.29:1; the old frame was
                4:3, which would have thrown away 42% of its width. At
                `LivingFrame`'s 21/9 almost nothing is cropped, so this
                moves out of the column and runs the width instead, which
                is also the Like a King shape: a heading, then the art
                full-bleed under it.

                **It is her clip repaired twice.** Its last 0.33 second is
                a hard cut to a different, much brighter shot, luma 71
                jumping to 104 and staying there, so that tail is trimmed;
                and it was not a loop, so an 0.7s `xfade` folds the end
                back over the start. Seam measures 5.2/255, well under
                where a cut becomes visible.

                This is also the rope. CLAUDE.md records Meg asking after
                "the video of the rope" and concludes there is none in
                either clip and she must be remembering the old Cable hero.
                She was not: it is in this one.
              */}
              <LivingFrame
                priority
                video="/ocean/moorings-band.mp4"
                poster="/ocean/moorings-band-poster.webp"
                alt="Looking up beneath a dock: barnacled pilings, two mooring ropes and daylight on the underside of the water."
                className="mt-12"
              />
            </div>
          </section>
          {/*
            The tool grid sits on the flat ground, not over the aurora.

            **The aurora came off this page on Nov 26 2026** and the whole
            page is now that flat ground, so this wrapper paints what is
            already there. It stays because what it says is still true and
            still the thing to check: the densest text on the site wants
            an opaque ground under it, and whatever arrives behind this
            section next has to leave that true. The measurements below
            are the aurora's and are kept as the record of why.

            Playground's category labels are 12px .text-faint, and
            --color-faint is tuned to clear 4.5:1 on #08070c specifically.
            Over the aurora it still passes, but only just: sampling the
            rendered pixels behind those labels gives #121f2b and 5.82:1,
            down from 7.00:1 on the flat ground. An opaque ground gives the
            densest text on the site the contrast the token was chosen for.

            It also settles a Lighthouse failure that is not what it looks
            like. axe reported 4.44:1 against #113837, which is cp-a2's
            rgba(45,212,191,.24) composited straight onto #08070c: it reads
            the lobe's own background-color and bounding box and applies
            neither the 90px blur nor any ancestor opacity or mask. So it
            was modelling a ground about three times stronger than the one
            that renders, and no amount of dimming or masking the layer
            could move the number. Giving the section a real background is
            the one change that is true in both models.
          */}
          <div className="relative bg-[var(--color-base)]">
            <Playground />
          </div>
        </main>
      </div>
      <Footer />
      {/* The floating "DAYLIGHT" pill lived here. It overlapped content on
          every page and on a phone sat on top of the cards. The theme
          toggle is now a command in the ⌘K palette (lib/theme.ts), so
          nobody who picked Harbor is stranded in it. */}
      <CommandPalette />
    </div>
  );
}

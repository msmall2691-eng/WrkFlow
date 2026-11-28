import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Playground from "@/components/Playground";
import StackedHeading from "@/components/StackedHeading";
import Reveal from "@/components/Reveal";
import LivingFrame from "@/components/ocean/LivingFrame";
import { siteNav, toolsPage } from "@/lib/content";
import { FREE_TOOL_COUNT } from "@/lib/tools";

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

  ─────────────────────────────────────────────────────────────────────────
  Nov 28 2026 — the tools are seen before they are clicked.

  Meg: "i want this site to be useful and give a plethora of things that
  can use love the free tools etc.. but id like them to see them sooner."
  Measured at 1440 before this change, this page was **2.72 screens, two
  sections, 35 buttons, two of its twenty-one links in the body, and zero
  `<h2>` on the whole document.** The eight tools were a row of unlabeled
  pills at y≈1,180 — below the fold, below a full-width video — and the
  only way to learn what seven of them did was to click them one at a
  time. Nothing on the page was scannable because nothing on it was a
  heading.

  Three changes, and `components/Playground.tsx` carries the reasoning for
  the first two:

  1. **The list leads.** Every tool's name and sentence, all nine on
     screen at once, in three groups with real headings.
  2. **The open tool has a name.** It is an `<h2>` that changes with the
     tool, so a visitor who has scrolled knows what they are filling in.
  3. **The art moved to the end, and that is this file's own decision.**

  On (3): the note below this used to argue the page had no picture at all
  and that the moorings belonged under the heading. The picture is still
  worth having and the position was the thing costing the page its
  purpose — at 1440 the clip ran from y≈430 to y≈940, so the first screen
  of the page named *for* the tools contained none of them. Moving it past
  the workbench keeps every word of that argument (the page has its
  picture, it is the full width, it is her own clip repaired twice, it
  moves) and spends the first screen on the thing the visitor came for.
  `priority` came off with the move, deliberately: that prop exists for an
  image that is genuinely first on its page, and this one no longer is.
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
          {/* Tighter than the other converted pages' py-12/16 on purpose.
              Meg's ask was that the tools be seen sooner; at 1440 the first
              card sat at y≈650 with this band taking the top third of the
              screen for a title and one sentence. Nothing is removed, the
              air is. */}
          <section className="border-b border-[var(--cp-line)] py-10 md:py-12">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                <div className="min-w-0 max-w-3xl">
                  {/*
                    `display` (Space Grotesk), not `display-serif`, and left
                    alone: this heading already used the panel's face, so
                    unlike /services there is nothing to decide here.
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
                  **The count, and it is read rather than typed.**
                  `FREE_TOOL_COUNT` adds the switcher's eight to the one
                  free tool that has a route of its own, so this number and
                  the list below it cannot disagree — the rule CLAUDE.md
                  sets for the project count under each service door, where
                  a count is a claim about evidence.

                  It also does a plain layout job. The heading left about
                  700px of empty right-hand column at 1440, which is what
                  the video used to be answering; one fact in the corner
                  closes the line without putting a picture between the
                  visitor and the tools.
                */}
                <p className="shrink-0 text-sm text-faint lg:text-right">
                  <span className="block font-mono text-[2.75rem] leading-none text-ink">
                    {FREE_TOOL_COUNT}
                  </span>
                  {/* "below", not "on this page": one of the nine is the
                      Turnover Planner, which is listed here and opens on
                      its own route. A count is only honest if the sentence
                      around it is. */}
                  <span className="mt-2 block">free tools below</span>
                </p>
              </div>
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

          {/*
            The closing band: the art, and the one thing this page is for
            past the calculators.

            **The moorings, and the reasoning for the clip itself is
            unchanged.** The homepage opens on the dive's own surface, so
            reusing that frame here made two pages look like one, and a
            working waterfront of ropes and pilings is the nearest thing
            in the set to Southern Maine and to free tools simply tied up
            and available.

            **It moves, and it is the full width.** Both are measurements
            rather than taste.

            The still was the problem Meg named out loud when she asked
            for no sharp edges, everything living in the background:
            `moorings.webp` reads luma 50.6 at its border against 109.9
            in the middle, which is the brightest border of any art on
            this site. There is nothing for a mask to dissolve, so it
            rendered as a lit rectangle on a near-black page, which is
            the one thing that rule forbids.

            And the column was the wrong shape for her clip. Her
            `4k-dive-header` is 1920x840, 2.29:1; the old frame was 4:3,
            which would have thrown away 42% of its width. At
            `LivingFrame`'s 21/9 almost nothing is cropped, so this runs
            the width rather than sitting in a column, which is also the
            Like a King shape: words, then the art full-bleed under them.

            **It is her clip repaired twice.** Its last 0.33 second is a
            hard cut to a different, much brighter shot, luma 71 jumping
            to 104 and staying there, so that tail is trimmed; and it was
            not a loop, so an 0.7s `xfade` folds the end back over the
            start. Seam measures 5.2/255, well under where a cut becomes
            visible.

            This is also the rope. CLAUDE.md records Meg asking after "the
            video of the rope" and concludes there is none in either clip
            and she must be remembering the old Cable hero. She was not:
            it is in this one.
          */}
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
                  {toolsPage.close.eyebrow}
                </p>
                <h2 className="display-serif mt-3 text-2xl text-ink sm:text-3xl md:text-4xl">
                  {toolsPage.close.heading}
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
                  {toolsPage.close.body}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                  {/*
                    No `data-offer`, and the href is absolute. A bare
                    `#contact` on a page that does not render the form is
                    the dead end `e2e/smoke.spec.ts` asserts against; this
                    page has no `<Contact />`, so the link leaves for the
                    one that does, carrying the same prefill the header's
                    button carries.
                  */}
                  <Link
                    href={toolsPage.close.cta.href}
                    className="font-semibold text-signal transition-opacity hover:opacity-80"
                  >
                    {toolsPage.close.cta.label} →
                  </Link>
                  <Link
                    href={toolsPage.close.secondary.href}
                    className="text-muted underline decoration-[var(--cp-hairline-strong)] underline-offset-4 transition-colors hover:text-ink"
                  >
                    {toolsPage.close.secondary.label}
                  </Link>
                </div>
              </Reveal>

              <LivingFrame
                video="/ocean/moorings-band.mp4"
                poster="/ocean/moorings-band-poster.webp"
                alt="Looking up beneath a dock: barnacled pilings, two mooring ropes and daylight on the underside of the water."
                className="mt-12"
              />
            </div>
          </section>
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

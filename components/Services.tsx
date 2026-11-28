import Image from "next/image";
import Link from "next/link";
import ProjectVisual from "./ProjectVisual";
import ServiceRungs from "./Ladder";
import Reveal from "./Reveal";
import { services, servicesPage } from "@/lib/content";

/*
  Services — the four categories, one band each.

  Every word comes from `services[]`, which CLAUDE.md names as the single
  definition of what the studio sells. A renamed category cannot disagree
  with the homepage rows that link here, and a fifth one appears with no
  edit.

  ───────────────────────────────────────────────────────────────────────────
  Nov 28 2026 — the wall.

  **This section measured 5,585px of a 10.7-screen page**, which is a thing
  a buyer scrolls past rather than reads. It had been an accordion before
  that, and opening all four rows was the right fix for the wrong problem:
  the rows got taller and nothing came out of them. Each one carried a
  16:10 screenshot, a second 16:10 frame of Meg's art, five paragraphs,
  three chips and a nine-card price grid, stacked.

  Three things came out, and each is a duplication rather than a cut:

  · **The art.** Four more 16:10 frames meant eight images on a page whose
    whole job is letting somebody recognize their own problem and act. The
    screenshots stay, because they are the evidence CLAUDE.md asks every
    section for; the art is brand, and the site still shows it where it is
    the subject rather than the spacer — `LivingFrame` on /tools and in
    `Approach`, and one still beside the homepage's statement. `CastFrame`
    keeps both of those callers, so nothing is orphaned by this.

  · **The price cards.** Fourteen bordered tiles became fourteen lines.
    See the note in `Ladder.tsx`: no item lost its price, its name, its
    sentence or its destination.

  · **The second price list.** `<Pricing />` moved to /pricing on Nov 27
    and /services kept rendering it too, so the custom-build tiers, the
    Care Plan, the promises and the FAQ were on the page twice on one
    site. The page links it in a line instead. Checked before removing:
    nothing targets `/services#pricing`, `<Pricing />` still has /pricing
    as a caller, and the e2e assertions on those tiers are scoped to
    /pricing.

  **The layout is the homepage's own**, because that is what "the same
  site one click later" means in practice: a hairline between bands, the
  index in mono, the title at the h2 step, the chips, and nothing boxed
  that a rule can separate just as well.

  The screenshot leads the right-hand column on every row rather than
  alternating. Alternation was worth it when a row was 1,400px tall and
  needed the variety; at this height the four bands read as one table,
  and a table that swaps its columns every other line is harder to scan,
  not easier.
*/
export default function Services() {
  return (
    <div id="services" className="scroll-mt-24">
      {services.map((s) => (
        <Reveal key={s.id}>
          <article
            /* Deep-linkable, because the homepage rows and the rail above
               both send people to a specific one of the four. */
            id={s.id}
            className="scroll-mt-24 border-t border-[color:var(--cp-line)] py-12 md:py-16"
          >
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  <p className="m-0 font-mono text-xs text-[color:var(--cp-faint)]">
                    {s.index}
                  </p>
                  <h2 className="m-0 mt-2 text-[1.625rem] font-semibold tracking-[-0.03em] text-[color:var(--cp-ink)] sm:text-[2rem]">
                    {s.title}
                  </h2>
                  <p className="m-0 mt-2.5 text-[1.0625rem] leading-relaxed text-[color:var(--cp-soft)]">
                    {s.tagline}
                  </p>

                  {/* The two sentences that do the selling: what is wrong
                      today, and what is true after. The rule beside the
                      second is the accent doing the work two labelled
                      boxes used to do with four lines of chrome. */}
                  <p className="m-0 mt-5 text-sm leading-relaxed text-[color:var(--cp-muted)]">
                    {s.pain}
                  </p>
                  <p className="m-0 mt-3 border-l-2 border-[color:var(--cp-violet-line)] pl-4 text-sm leading-relaxed text-[color:var(--cp-ink)]">
                    {s.outcome}
                  </p>

                  <ul className="m-0 mt-5 flex list-none flex-wrap gap-1.5 p-0">
                    {s.kinds.map((k) => (
                      <li
                        key={k}
                        className="rounded-full border border-[color:var(--cp-hairline)] px-2.5 py-1 text-xs text-[color:var(--cp-faint)]"
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The evidence. */}
                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-xl border border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
                    <div className="relative aspect-[16/10]">
                      {/* Not every service has a capture yet — custom
                          software is real work with nothing photogenic to
                          screenshot, so it falls back to the designed
                          panel rather than an empty frame. Never
                          substitute someone else's screen for a missing
                          one. */}
                      {s.example.shot ? (
                        <Image
                          src={s.example.shot}
                          alt={`${s.example.client}: ${s.example.built}`}
                          fill
                          sizes="(min-width: 1024px) 440px, 100vw"
                          className="object-cover object-top"
                        />
                      ) : (
                        <ProjectVisual type={s.example.visual!} />
                      )}
                    </div>
                  </div>
                  <p className="m-0 mt-3 text-xs text-[color:var(--cp-faint)]">
                    {s.example.client}
                  </p>
                  <p className="m-0 mt-1.5 text-[13px] leading-relaxed text-[color:var(--cp-soft)]">
                    {s.example.result}
                  </p>
                  {/*
                    `/#work`, not `#work`. This page has no #work anchor,
                    so the relative version was a live-looking link that
                    scrolled nowhere. The anchor is on the homepage, which
                    is where "see an example" is actually answered.
                  */}
                  <Link
                    href="/#work"
                    className="mt-3 inline-flex w-fit items-center py-1.5 text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline transition-opacity hover:opacity-80"
                  >
                    {servicesPage.example}
                    <span aria-hidden="true">&nbsp;→</span>
                  </Link>
                </div>
              </div>

              <ServiceRungs service={s.id} />
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

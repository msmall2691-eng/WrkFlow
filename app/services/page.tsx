import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { ladder, ladderRungs, services, servicesPage, siteNav } from "@/lib/content";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import ForRentals from "@/components/ForRentals";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";
import StackedHeading from "@/components/StackedHeading";

/*
  Services — the four categories, what each one costs, and a way to act.

  ───────────────────────────────────────────────────────────────────────────
  Nov 28 2026 — the page was a wall, and this is the measurement rather
  than the impression.

  At 1440x900 it ran **10.7 screens over five sections, one of which was
  5,585px**; at 390 it ran 17. Somebody arrives here knowing roughly what
  they want built, and the job is to let them see the four categories,
  recognize theirs, learn what it costs, and do something. None of that
  needs ten screens, and at ten screens most of it does not happen.

  What the length was actually made of, in order of size:

  1. **Four service rows at ~1,400px each.** Each carried a 16:10
     screenshot *and* a 16:10 frame of Meg's art, five paragraphs, three
     chips, and then a three-column grid of bordered price cards. Eight
     images and fourteen tiles on a page meant to be scanned.
  2. **A second copy of the price list.** `<Pricing />` moved to its own
     route on Nov 27 with the Linx Brand Plan; this page went on
     rendering it, so the custom build, the Care Plan, the four promises
     and the FAQ existed twice on one site, 2,000px apart from the
     ladder that already carries the four fixed prices.

  So the rebuild is subtraction plus one addition:

  · **A rail of the four categories, in the first screen.** This is the
    recognition step and it had no home before — a visitor landed on a
    72px heading and then fell straight into the first category, with no
    way to see that there were four or which one was theirs without
    scrolling past all of them. It is built from `services[]` and the
    rung labels under each door are counted off `ladder`, so neither can
    claim a category or a way in that does not exist.
  · `<Pricing />` is **gone, not moved.** Checked before removing it:
    nothing in the repo targets `/services#pricing`, the component still
    has /pricing as a caller so it is not orphaned, and every e2e
    assertion about the custom build, the Care Plan, the promises and
    `smallProjects` on a price *list* is scoped to /pricing.

  ───────────────────────────────────────────────────────────────────────────
  Nov 28 2026, later the same day — **no amount renders here at all.**

  Meg asked for real prices off the site while the shape of it is being
  settled. That is a bigger change to this page than it sounds, because
  the fourteen ways in were being *sold* by their prices: a strip of
  "Free · $250–$500 · Quoted to your scope" was most of what a visitor
  read in each band.

  What replaced them is not silence, which would have been the easy
  half. A category somebody wants with no way to begin is worse than one
  with a number on it, so `servicesPage.start` says what the first step
  is, what comes back and how long it takes, and the ways in keep their
  names, their sentences and their destinations. `Ladder.tsx` resolves
  each price and declines to render it, so the suite still proves every
  id points at something real.

  Two things went with the prices rather than being reworded:

  · **"and what it costs" in the h1.** A title promising a number the
    page does not show is the page's own first broken promise.
  · **The three rungs explained in the head.** `ladderRungs[].note` is
    still what a rung *is*, and two of the three sentences describe a
    price ("a real price for one agreed piece of work"). Kept, they
    would have sent somebody looking for an amount that is not here. The
    labels still head the ways in and still name the doors in the rail,
    counted off `ladder`, so nothing about how a thing is obtained was
    lost with the sentences.

  Measured on the built page, both passes together: **6.4 screens at
  1440 and 11.2 at 390, tallest section 840px**, against 10.7 screens
  and a single 5,501px section before. The four categories, all fourteen
  ways in and the form are all still on it.

  ───────────────────────────────────────────────────────────────────────────
  What the previous passes settled, and which still holds.

  **The wrapper is `cp cp-inner`.** `.cp-inner` re-points every `--cp-*`
  and legacy `--color-*` at the approved homepage's own tokens, so this
  page is the same near-black world, the same face and the same single
  accent as the page it is reached from — in both themes, deliberately,
  because the homepage has no light branch. See the block at the foot of
  `app/globals.css`.

  **The header is the homepage's**, in flow. See `StageTopBar`.

  **The h1's size, weight, tracking and step-back come from
  `StackedHeading`**, which is the one author of a page title; only the
  face is decided here, and under `.cp-inner` both of its answers resolve
  to Inter Tight anyway. `face="serif"` is left on it rather than tidied
  away, because the prop exists to record that unifying the scale did not
  settle the typeface, and that is still Meg's open call about her own
  brand.
*/
export const metadata: Metadata = pageMeta({
  title: "Services & pricing",
  description:
    "Websites, CRM setup, data migration, integrations and custom business tools for small businesses. Scope and price agreed before work begins.",
  path: "/services",
});

export default function ServicesPage() {
  /*
    What each door promises, counted off the ladder rather than written
    down. A category with no fixed-price piece says so by leaving that
    word out — `software` has none, and squaring the row by typing one in
    would be inventing a price.
  */
  const rungsFor = (id: (typeof services)[number]["id"]) =>
    ladderRungs.filter((r) => ladder.some((i) => i.service === id && i.rung === r.id));

  return (
    <div className="cp cp-inner">
      <div className="relative overflow-hidden">
        <StageTopBar inFlow cta="book" nav={siteNav} here="Services" />

        <main className="relative z-10">
          <section className="pb-10 pt-10 md:pb-14 md:pt-14">
            <div className="mx-auto max-w-6xl px-6">
              <p className="m-0 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[color:var(--cp-faint)]">
                {servicesPage.eyebrow}
              </p>
              <StackedHeading
                as="h1"
                face="serif"
                className="mt-4"
                lead={servicesPage.heading.lead}
                trail={servicesPage.heading.trail}
              />
              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-[color:var(--cp-soft)]">
                {servicesPage.audience}
              </p>

              {/*
                The rail: the recognition step, in the first screen.

                A `nav` of four links rather than four cards. Each names
                the category, says what it is in one line, and lists the
                ways in that actually exist for it — which is the "how is
                this priced" answer at a glance, before any scrolling.
              */}
              <nav aria-label={servicesPage.railLabel} className="mt-10">
                <h2 className="m-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-[color:var(--cp-faint)]">
                  {servicesPage.railLabel}
                </h2>
                <ul className="m-0 mt-4 grid list-none gap-px border-y border-[color:var(--cp-hairline)] bg-[color:var(--cp-hairline)] p-0 sm:grid-cols-2 lg:grid-cols-4">
                  {services.map((s) => (
                    <li key={s.id} className="bg-[color:var(--ink)]">
                      <a
                        href={`#${s.id}`}
                        className="flex h-full min-w-0 flex-col gap-1.5 p-4 no-underline transition-colors hover:bg-[color:var(--cp-fill)]"
                      >
                        <span className="font-mono text-[11px] text-[color:var(--cp-violet-ink)]">
                          {s.index}
                        </span>
                        <span className="text-[15px] font-semibold leading-snug text-[color:var(--cp-ink)]">
                          {s.title}
                          <span aria-hidden="true" className="text-[color:var(--cp-faint)]">
                            &nbsp;↓
                          </span>
                        </span>
                        <span className="text-[13px] leading-snug text-[color:var(--cp-muted)]">
                          {s.tagline}
                        </span>
                        <span className="mt-auto pt-2 text-[11.5px] leading-snug text-[color:var(--cp-faint)]">
                          {rungsFor(s.id)
                            .map((r) => r.label)
                            .join(" · ")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/*
                How it starts, which is what replaced the prices. One
                sentence and one link: the first step, what comes back,
                and how long that takes.
              */}
              <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-[color:var(--cp-muted)]">
                {servicesPage.start.body}{" "}
                <Link
                  href={servicesPage.start.cta.href}
                  className="font-semibold text-[color:var(--cp-violet-ink)] no-underline transition-opacity hover:opacity-80"
                >
                  {servicesPage.start.cta.label}
                  <span aria-hidden="true">&nbsp;→</span>
                </Link>
              </p>
            </div>
          </section>

          <Services />

          <section className="border-t border-[color:var(--cp-line)] py-8">
            <div className="mx-auto max-w-6xl px-6">
              <Link
                href={servicesPage.catalog.href}
                className="inline-flex w-fit items-center py-1.5 text-sm font-semibold text-[color:var(--cp-violet-ink)] no-underline transition-opacity hover:opacity-80"
              >
                {servicesPage.catalog.label}
                <span aria-hidden="true">&nbsp;→</span>
              </Link>
            </div>
          </section>

          <ForRentals />
          <Contact />
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}

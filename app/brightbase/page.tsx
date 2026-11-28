import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { brightbase } from "@/lib/brightbase";
import { approachSteps, siteNav } from "@/lib/content";
import StageTopBar from "@/components/stage/StageTopBar";
import OfferLink from "@/components/OfferLink";
import BookCall from "@/components/BookCall";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import { HeroShots, Pipeline, Roles } from "@/components/brightbase/Showcase";
import DataModel from "@/components/brightbase/DataModel";
import StackedHeading from "@/components/StackedHeading";

/*
  /brightbase — the showcase for the operations app Meg built and runs her
  cleaning company on.

  Content lives in lib/brightbase.ts, with the rules for what may be listed.
  The short version: built and in use, or it goes under "In progress".

  **Nov 27 2026: converted to `.cp-inner`, and it was the one that mattered
  most.** The homepage hero asks a visitor which of three things they are,
  and this page is behind the middle door: "I run a service business". Two
  of those doors landed on the new design and this one landed on the old
  panel with the old header, so the single most deliberate click on the
  front page was also the one that changed the website. That is the exact
  failure `.cp-inner` and one shared `StageTopBar` exist to prevent, shipped
  inside the change that introduced the doors.

  Per CLAUDE.md the conversion is adding the class and swapping the header,
  not a rewrite: every section, every `cp-tile`, `Pipeline`, `Roles`,
  `DataModel` and both screenshots are untouched, and they re-point because
  `.cp-inner` re-points the `--cp-*` tokens underneath them.

  **Nov 28 2026: the argument was fine and the ending was not.** Measured
  at 1440x900 before this pass: six sections, three pictures, twenty-nine
  buttons and **four links in the whole page body**. A visitor who
  arrived through the middle door and was convinced by the middle of the
  page had almost nowhere to go, which is a strange way to treat the
  most deliberate click on the front page.

  Four changes, and nothing else moved:

    · **the hero shows all three apps** rather than announcing them two
      screens later. `heroPhones` is the crew's phone and the customer's
      beside the office screen, the same captures their roles use below;
    · **a "Sound familiar" band** between the hero and the flow, so the
      problem is named before anything is demonstrated. Every line is
      the case study's own recorded problem with the first person taken
      out of it, and it links to that case study rather than quoting a
      number here;
    · **the last band is the step, not a form.** Meg: "plan how they
      will easily obtain products or sites or tools". So it says what
      happens, in order: a fifteen-minute call on your own jobs, then
      `approachSteps` — the same four steps every build here follows,
      read from lib/content.ts rather than retyped;
    · **the primary CTA books the call** instead of scrolling to the
      form, in the hero and in that band, from one string.

  **There is no money anywhere on this page** (Meg, Nov 28: "leave
  pricing off for now"). That is why the ways out are the demos and the
  free tools rather than /services or /catalog, and why the step list
  ends at handover.

  `Pipeline`, `Roles`, `DataModel` and the integration and proof tiles
  are untouched, and `app/globals.css` is not touched at all.

  The two `cp-aurora` spans came off, which is the one removal here. They
  are decorative, `aria-hidden`, and `.cp-inner` does not restyle them, so
  keeping them would have left this the only converted page wearing a
  violet blur the other six dropped. They stay in use on the three routes
  still outside the pass (`/demo`, `/welcome-book`, `LegalDoc`), so nothing
  is deleted, only no longer rendered here.
*/
export const metadata: Metadata = pageMeta({
  title: "BrightBase, the operations app for cleaning companies",
  description:
    "Leads, quotes, scheduling, a crew phone app, invoicing and Stripe payouts in one system. Built by Meg Small and run daily at The Maine Cleaning Co.",
  path: "/brightbase",
});

const Eyebrow = ({ children, tone = "violet" }: { children: React.ReactNode; tone?: "violet" | "teal" | "pink" }) => (
  <span
    className={`text-[13px] font-medium ${
      tone === "teal" ? "text-[color:var(--cp-teal)]" : tone === "pink" ? "text-[color:var(--cp-pink)]" : "text-[color:var(--cp-violet-ink)]"
    }`}
  >
    {children}
  </span>
);

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="m-0 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-[color:var(--cp-ink)]">
    {children}
  </h2>
);

export default function BrightBasePage() {
  /* Every string on this page comes from here. */
  const bands = brightbase.bands;

  return (
    <div className="cp cp-inner">
      <div className="relative overflow-hidden">
        <StageTopBar inFlow cta="book" nav={siteNav} here="BrightBase" />

        <main className="relative z-10 mx-auto flex max-w-[1240px] flex-col gap-24 px-6 pb-24 pt-8 lg:px-10">
          {/* Hero */}
          <section className="grid grid-cols-12 items-center gap-y-10 lg:gap-x-10">
            <div className="min-w-0 col-span-12 flex flex-col gap-6 lg:col-span-6">
              <Eyebrow tone="teal">{bands.hero.eyebrow}</Eyebrow>
              {/* The split is lopsided on purpose. This hero is the one
                  two-column one on the site, so the heading lives in a
                  ~480px grid column rather than the full width, and at 72px
                  that wraps hard. Split evenly, the stepped-back half ran to
                  three grey lines and read as a wrap accident rather than a
                  composition. A long lead and a two-word trail keeps exactly
                  one line stepped, which is the gesture. */}
              <StackedHeading as="h1" lead={bands.hero.lead} trail={bands.hero.trail} />
              <p className="m-0 max-w-[36em] text-[17px] leading-relaxed text-[color:var(--cp-muted)]">{brightbase.summary}</p>
              {/* **The primary action is the real one.** It was "Get a
                  demo", which scrolled to the form; the demo is a
                  fifteen-minute call and `BookCall` is the one component
                  that opens the scheduler when one is configured. Said
                  the same way here and in the closing band, from one
                  string, because two labels for one action is two
                  actions as far as a visitor can tell. */}
              <div className="flex flex-wrap gap-3">
                <BookCall
                  where="brightbase-hero"
                  /* **Not `cp-cta`.** That class is a violet gradient
                     `.cp-inner` does not re-point, so the one biggest
                     button on the page was the only violet thing left
                     on a page whose every other accent is the design's
                     teal. This is the design's own solid button, paper
                     under near-black ink, the same pair the closing
                     band uses. */
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[color:var(--cp-ink)] px-5 py-3.5 text-[15px] font-semibold text-[color:var(--cp-on-ink)] no-underline transition-transform duration-150 hover:-translate-y-0.5"
                >
                  {bands.hero.cta} <span aria-hidden="true">→</span>
                </BookCall>
                <a
                  href="#inside"
                  className="inline-flex items-center rounded-xl border border-[color:var(--cp-hairline-strong)] px-5 py-3.5 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline"
                >
                  {bands.hero.see}
                </a>
              </div>
            </div>
            <div className="min-w-0 col-span-12 lg:col-span-6">
              <HeroShots />
            </div>
          </section>

          {/*
            **The problem, before anything is shown.** A visitor arriving
            through the homepage's middle door picked "I run a service
            business", and the first thing this page owes them is the
            thing they came in with. Every line is `caseStudies
            [maine-cleaning-co].problem` with the first person taken out
            of it, and the link is how somebody gets to the number behind
            it rather than reading one here.
          */}
          <section aria-labelledby="bb-arrived" className="grid grid-cols-12 gap-y-6 lg:gap-x-10">
            <div className="min-w-0 col-span-12 flex flex-col gap-3 lg:col-span-5">
              <Eyebrow tone="pink">{bands.arrived.eyebrow}</Eyebrow>
              <H2 id="bb-arrived">{bands.arrived.heading}</H2>
            </div>
            <div className="min-w-0 col-span-12 flex flex-col gap-4 lg:col-span-7">
              <ul className="m-0 flex list-none flex-col gap-0 p-0">
                {bands.arrived.lines.map((line) => (
                  <li
                    key={line}
                    className="border-b border-[color:var(--cp-line)] py-3 text-[17px] leading-relaxed text-[color:var(--cp-soft)] first:border-t"
                  >
                    {line}
                  </li>
                ))}
              </ul>
              <Link
                href={bands.arrived.href}
                className="inline-flex items-center gap-2 self-start text-[15px] font-medium text-[color:var(--cp-violet-ink)] no-underline"
              >
                {bands.arrived.link} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          {/* Pipeline */}
          <section aria-labelledby="bb-flow" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>{bands.flow.eyebrow}</Eyebrow>
              <H2 id="bb-flow">{bands.flow.heading}</H2>
            </div>
            <Pipeline />
          </section>

          {/* Roles */}
          <section id="inside" aria-labelledby="bb-roles" className="flex scroll-mt-8 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>{bands.inside.eyebrow}</Eyebrow>
              <H2 id="bb-roles">{bands.inside.heading}</H2>
            </div>
            <Roles />
          </section>

          {/* Data model */}
          <section id="data" aria-labelledby="bb-data" className="flex scroll-mt-8 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow tone="pink">{bands.data.eyebrow}</Eyebrow>
              <H2 id="bb-data">{bands.data.heading}</H2>
              <p className="m-0 max-w-[62ch] text-[16px] leading-relaxed text-[color:var(--cp-muted)]">{bands.data.body}</p>
            </div>
            <DataModel />
          </section>

          {/* Integrations */}
          <section aria-labelledby="bb-int" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow tone="teal">{bands.integrations.eyebrow}</Eyebrow>
              <H2 id="bb-int">{bands.integrations.heading}</H2>
            </div>
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
              {brightbase.integrations.map((it) => (
                <li key={it.name} className="cp-tile flex flex-col gap-1 p-4">
                  <span className="text-[15px] font-semibold text-[color:var(--cp-ink)]">{it.name}</span>
                  <span className="text-[13px] text-[color:var(--cp-muted)]">{it.what}</span>
                </li>
              ))}
            </ul>
            {/* The booking-calendar row of the list above, running in
                public and free, so the way in sits where it is earned
                rather than being collected into the closing band. */}
            <Link
              href={bands.integrations.href}
              className="inline-flex items-center gap-2 self-start text-[15px] font-medium text-[color:var(--cp-violet-ink)] no-underline"
            >
              {bands.integrations.link} <span aria-hidden="true">→</span>
            </Link>
          </section>

          {/* Proof + in progress */}
          <section aria-label="Proof and what is next" className="grid grid-cols-12 gap-4">
            {brightbase.proof.map((p) => (
              <div
                key={p.label}
                /* The span follows the count. These tiles were three at
                   `md:col-span-4`, filling the twelve-column row exactly;
                   dropping the "4,000+ automated checks" tile left 4 columns
                   of hole before the col-span-7 tile below, which wraps. */
                className={`cp-tile col-span-12 flex flex-col gap-1 p-6 ${
                  brightbase.proof.length === 2 ? "md:col-span-6" : "md:col-span-4"
                }`}
              >
                <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-[color:var(--cp-ink)]">{p.value}</span>
                <span className="text-[14px] text-[color:var(--cp-muted)]">{p.label}</span>
              </div>
            ))}
            <div className="cp-tile col-span-12 flex flex-col gap-4 p-6">
              <Eyebrow tone="pink">{bands.progress}</Eyebrow>
              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
                {brightbase.comingNext.map((c) => (
                  <li key={c.title} className="flex flex-col gap-0.5">
                    <span className="text-[15.5px] font-semibold text-[color:var(--cp-ink)]">{c.title}</span>
                    <span className="text-[14px] text-[color:var(--cp-muted)]">{c.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/*
            **The ending is the step.** Measured before this, the page
            body held four links and twenty-nine buttons: it argued well
            and then left a convinced visitor at a form. So the last band
            is what actually happens, in order, and nothing on it is
            signup-shaped, because one company runs on this.

            Steps 02 to 04 are `approachSteps`, the same four-step
            process every build on this site follows, read rather than
            retyped. Step 00 is the one that happens here. There is no
            money on this page at all, which is why the step list ends at
            handover and not at a figure.
          */}
          <section aria-labelledby="bb-next" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow tone="teal">{bands.next.eyebrow}</Eyebrow>
              <H2 id="bb-next">{bands.next.heading}</H2>
              <p className="m-0 max-w-[62ch] text-[16px] leading-relaxed text-[color:var(--cp-muted)]">{bands.next.body}</p>
            </div>

            <ol className="m-0 grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-2">
              {[bands.next.first, ...approachSteps].map((s, n) => (
                <li
                  key={s.index}
                  className={`flex gap-4 border-t border-[color:var(--cp-line)] py-4 ${
                    n === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <span className="font-mono text-[12px] leading-6 text-[color:var(--cp-violet-ink)]">{s.index}</span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[15.5px] font-semibold text-[color:var(--cp-ink)]">{s.title}</span>
                    <span className="max-w-[46ch] text-[14px] leading-relaxed text-[color:var(--cp-muted)]">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="cp-tile cp-tile-cta flex flex-col gap-5 p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <h2 className="m-0 max-w-[26em] font-display text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[color:var(--cp-ink)]">
                  {bands.close.heading}
                </h2>
                <div className="flex flex-wrap gap-3">
                  <BookCall
                    where="brightbase"
                    className="rounded-[10px] bg-[color:var(--cp-ink)] px-4 py-3 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    {bands.close.book}
                  </BookCall>
                  <OfferLink offer="brightbase" className="rounded-[10px] border border-[color:var(--cp-hairline-strong)] px-4 py-3 text-[14px] font-medium text-[color:var(--cp-ink)] no-underline">
                    {bands.close.ask}
                  </OfferLink>
                </div>
              </div>
              {/* For somebody not ready to talk. Both are usable without
                  asking anybody, and neither opens a page of prices. */}
              <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[color:var(--cp-muted)]">
                {bands.close.look}
                {bands.close.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-[color:var(--cp-ink)] underline decoration-[color:var(--cp-hairline-strong)] underline-offset-4">
                    {l.label}
                  </Link>
                ))}
              </p>
            </div>
          </section>
        </main>
      </div>

      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}

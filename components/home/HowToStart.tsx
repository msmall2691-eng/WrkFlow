import Link from "next/link";
import { studioStats } from "@/lib/content";
import StackedHeading from "./StackedHeading";

/*
  HowToStart — the last beat, and the one the old homepage skipped.

  The V2 panel went headline → screenshots → project names → free tools →
  weather → contact form. A visitor who had decided they were interested
  arrived at a form with no idea what pressing send would set in motion, how
  long it takes, or what it costs to find out. The three most common reasons
  somebody does not fill in a form on a site like this are "I don't know
  what happens next", "I don't want a sales call" and "I can't afford to
  ask", and nothing on the page answered any of them.

  So this says it in three lines and then shows the four promises from
  `studioStats`, which are M Studio's own commitments about its own process
  rather than claims about results. They were sitting beside the pricing
  cards on /services, which is the page somebody reaches after they have
  already decided to enquire.

  The free tools are the escape hatch rather than a tile competing for
  attention up top: somebody who is not ready to talk gets one line and a
  link, which is the right weight for it.

  No price here on purpose. CLAUDE.md's Nov 2026 note on Pricing says the
  risk Meg actually has is a small local business reading a four-figure
  number and never asking, so the number lives on /services behind "let's
  scope it", and this page sells the scoping instead.
*/

/*
  `answer` and `caption` are the reference's terminal beat: a short, large
  pull-out and a mono line under it, which is what gives each card an end
  instead of just stopping.

  **Every one of them restates something already in its own `body`.** That
  is deliberate, and it is also what the reference does — its "Core Web
  Vitals / built to pass" sits under a paragraph that already said so. A
  pull-out is a place a new claim would be very easy to invent and very hard
  to notice, so the rule for this field is that it may only re-say the
  sentence above it: two minutes, within a day, costs nothing.
*/
const STEPS = [
  {
    n: "01",
    title: "Say what is not working",
    body: "The form below, about two minutes. A call is optional and not the first step.",
    answer: "~2 min",
    caption: "the form below",
  },
  {
    n: "02",
    title: "A written scope comes back",
    body: "Within a day: what gets built, what it costs, and what it does not include.",
    answer: "1 day",
    caption: "written, not a call",
  },
  {
    n: "03",
    title: "You decide from there",
    body: "Scoping costs nothing and commits you to nothing. The code is yours either way.",
    answer: "$0",
    caption: "to find out",
  },
] as const;

export default function HowToStart() {
  return (
    <section
      aria-labelledby="start-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <StackedHeading id="start-heading" lead="How a project" trail="starts." />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            /* The reference's card: hairline, number, title, body, then the
               pull-out pushed to the foot by `mt-auto` so three cards of
               different body lengths still line their answers up. Border and
               fill are tokens, never hardcoded white, which is the rule this
               repo has broken three times. */
            <li
              key={s.n}
              className="flex flex-col rounded-xl border border-[color:var(--cp-hairline)] bg-[color:var(--cp-fill)] p-6"
            >
              <span className="font-mono text-[12px] tracking-[0.1em] text-[color:var(--cp-faint)]">
                {s.n}
              </span>
              <h3 className="m-0 mt-3 text-[1.0625rem] font-semibold text-[color:var(--cp-ink)]">
                {s.title}
              </h3>
              <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-[color:var(--cp-muted)]">
                {s.body}
              </p>

              <div className="mt-8 pt-2">
                <span className="block font-display text-[1.75rem] font-normal leading-none tracking-[-0.03em] text-[color:var(--cp-ink)]">
                  {s.answer}
                </span>
                <span className="mt-2 block font-mono text-[11px] text-[color:var(--cp-faint)]">
                  {s.caption}
                </span>
              </div>
            </li>
          ))}
        </ol>

        {/* The promises, from lib/content.ts. These are about the process,
            not about results, which is why they are safe to show while every
            client outcome field in the repo is still empty. */}
        <dl className="mt-12 grid grid-cols-2 gap-4 border-t border-[color:var(--cp-line)] pt-10 lg:grid-cols-4">
          {studioStats.map((s) => (
            <div key={s.label} className="cp-tile px-4 py-3.5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="m-0">
                <span className="block font-display text-xl font-semibold text-[color:var(--cp-ink)]">
                  {s.value}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[color:var(--cp-faint)]">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-[14.5px] text-[color:var(--cp-muted)]">
          Not ready to talk?{" "}
          <Link
            href="/tools"
            className="font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
          >
            Try the free tools on this site
          </Link>{" "}
          first. No sign-up, nothing to install.
        </p>
      </div>
    </section>
  );
}

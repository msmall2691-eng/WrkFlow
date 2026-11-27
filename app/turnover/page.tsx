import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import StageTopBar from "@/components/stage/StageTopBar";
import { siteNav } from "@/lib/content";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import TurnoverPlanner from "@/components/TurnoverPlanner";
import StackedHeading from "@/components/StackedHeading";

/*
  V2 pass. The usual wrapper: `.cp` redefines the old token names in its own
  scope, so TurnoverPlanner takes the V2 palette without being touched.

  `display`, not `display-serif`, on the h1. This page's only other headings
  come from TurnoverPlanner and are set in the panel's own face, so a Fraunces
  h1 would be the single serif on the page. /services keeps Fraunces because
  every heading under it is already Fraunces; the opposite is true here.

  `bookHref` is set because this page renders no Contact; e2e/smoke.spec.ts
  covers the route.
*/
export const metadata: Metadata = pageMeta({
  title: "Turnover Planner for Short-Term Rentals",
  description:
    "Paste your Airbnb or Vrbo calendar and get the cleaning schedule it implies, with same-day turnarounds flagged. Free, nothing stored.",
  path: "/turnover",
});

/*
  Answered from the code, not from the roadmap. Each one was checked
  against what `TurnoverPlanner` and `/api/turnover` actually do today.
*/
const FAQ: { q: string; a: string }[] = [
  {
    q: "Is it really free?",
    a: "Yes. No card, no account, and no limit on how many times you use it. There is nothing to upgrade to yet.",
  },
  {
    q: "Which calendars work?",
    a: "Any booking calendar that publishes an .ics link, which is Airbnb, Vrbo and Booking.com among others. Paste the link, or paste the file's contents if your platform only lets you download it.",
  },
  {
    q: "Do my cleaners need an account?",
    a: "No. Nobody needs an account, including you. Download the calendar file and send it to whoever does the work, or email yourself the schedule and forward it.",
  },
  {
    q: "Who made this?",
    a: "A Maine cleaning company owner who got tired of planning turnovers by text. It is one piece of the system that company runs on.",
  },
];

export default function TurnoverPage() {
  return (
    <div className="cp cp-inner">
      <div className="relative overflow-hidden">
        {/* `bookHref` because this page renders no Contact: without it the
            bar's call CTA points at an in-page #contact that does not exist
            here, which `/turnover has no dead-end booking CTA` catches. It
            is the same reason PanelHeader carried it before the conversion. */}
        <StageTopBar
          inFlow
          cta="book"
          bookHref="/?offer=call#contact"
          nav={siteNav}
          here="Turnover planner"
        />

        <main className="relative z-10">
        <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <StackedHeading
              as="h1"
              lead="Your bookings,"
              trail="as a cleaning schedule."
            />
            <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-muted">
              Paste the calendar your booking platform already publishes. You
              get one cleaning per checkout, the same-day turnarounds marked,
              and a calendar file you can hand to whoever does the work.
              It runs in the page, there is no account, and nothing is
              emailed unless you ask for it.
            </p>

            <div className="mt-10 max-w-3xl">
              <TurnoverPlanner />
            </div>

            {/*
              The point of the tool, said plainly. It is the Maine Cleaning
              workflow with the visitor's own data in it, so the link to the
              case study is the argument, not a footnote.
            */}
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
              {/*
                **This said "with 1,000+ customers", and that number lives
                nowhere.** `provingGround` is where the real figures are, it
                is verified against Jobber exports, and it holds 8 yrs, $1M+,
                4,900+ visits and 63% rebooked. Not this. An outcome number
                with no source is the first rule on this site broken on a
                page most people reach from a search result.

                Swapped for a figure that is in that list rather than deleted,
                because the sentence needs a sense of scale to make its point.
                If 1,000+ customers is true it belongs in `provingGround`
                first, and then this line can quote it.
              */}
              This is one piece of a system built for a cleaning company with
              4,900+ service visits behind it: bookings arrive, turnovers land
              on the crew schedule, nobody retypes anything.{" "}
              <Link
                href="/work/maine-cleaning-co"
                className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
              >
                See how that one works
              </Link>
              .
            </p>

            {/*
              The four questions the brand plan asks for, answered from
              how the planner actually behaves rather than from how it is
              meant to one day.

              **The plan's fifth section is deliberately missing.** It
              offers calendar sync and cleaner alerts at $8 per property
              per month, and its own checklist says "Sync and cleaner
              alerts actually work, or Section 5 stays hidden". They do
              not: the planner reads a calendar once and hands back a
              file. There is no stored sync, no re-read and no alert, so
              there is nothing to sell yet and the answer below says the
              true thing instead.
            */}
            <div className="mt-14 max-w-2xl">
              <h2 className="display text-xl text-ink">Questions</h2>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {FAQ.map((f) => (
                  <div key={f.q} className="py-4">
                    <dt className="text-[15px] font-semibold text-ink">{f.q}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}

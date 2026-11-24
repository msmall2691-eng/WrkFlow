import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
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

export default function TurnoverPage() {
  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader bookHref="/?offer=call#contact" />
        </div>

        {/* No pt-16: that cleared the fixed <Nav>, and PanelHeader is in flow. */}
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
              Nothing is saved and nothing is emailed.
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
              This is one piece of a system built for a cleaning company
              with 1,000+ customers: bookings arrive, turnovers land on the
              crew schedule, nobody retypes anything.{" "}
              <Link
                href="/work/maine-cleaning-co"
                className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
              >
                See how that one works
              </Link>
              .
            </p>
          </div>
        </section>
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}

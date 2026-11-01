import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TurnoverPlanner from "@/components/TurnoverPlanner";

export const metadata: Metadata = pageMeta({
  title: "Turnover Planner for Short-Term Rentals",
  description:
    "Paste your Airbnb or Vrbo calendar and get the cleaning schedule it implies, with same-day turnarounds flagged. Free, nothing stored.",
  path: "/turnover",
});

export default function TurnoverPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="border-b border-line py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="display-serif max-w-3xl text-[2rem] text-balance text-ink sm:text-4xl md:text-5xl">
              Your bookings, as a cleaning schedule.
            </h1>
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
              This is one piece of a system I built for a cleaning company
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
      <Footer />
    </>
  );
}

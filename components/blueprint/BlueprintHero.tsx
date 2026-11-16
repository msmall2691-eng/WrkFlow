import Link from "next/link";
import PanelHeader from "../panel/PanelHeader";
import BookCall from "../BookCall";
import BlueprintCanvas from "./BlueprintCanvas";
import SiteLog from "./SiteLog";

/*
  The homepage opening (Nov 16 2026, "Blueprint").

  Meg picked two references: Ostrander Signal, for the full-screen moving
  opening with a huge wordmark sitting in the bottom-left corner, and
  Ironline Builders, for the drafting-sheet look and the live job-site log at
  the top. This is neither one copied. The moving background is a blueprint
  of a web page being drawn (BlueprintCanvas), which says what the studio
  does without a sentence, and the log is real Maine time and weather.

  The h1 is the real sentence, not the wordmark, so the page still reads
  correctly to search engines and screen readers.
*/
export default function BlueprintHero() {
  return (
    <section id="top" className="bp-hero relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <BlueprintCanvas className="absolute inset-0 -z-10 h-full w-full" />
      <div aria-hidden="true" className="bp-hero-vignette absolute inset-0 -z-10" />

      <PanelHeader />

      <div className="flex justify-center px-6">
        <SiteLog />
      </div>

      <div className="relative mx-auto mt-auto grid w-full max-w-[1400px] gap-10 px-6 pb-10 pt-16 lg:grid-cols-12 lg:items-end lg:px-10 lg:pb-14">
        <div className="lg:col-span-7">
          <p aria-hidden="true" className="bp-wordmark">
            <span className="block">M Studio</span>
            <span className="bp-wordmark-serif block">
              Built in Maine<span className="bp-dot">.</span>
            </span>
          </p>
        </div>

        <div className="max-w-md lg:col-span-5 lg:justify-self-end lg:pb-6">
          <p className="bp-eyebrow">
            <span className="text-[color:var(--bp-print)]">[ 00 ]</span> Websites · plug-ins · apps
          </p>
          <h1 className="mt-4 font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-[color:var(--bp-paper)] sm:text-[34px]">
            Websites and software that bring in work.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[color:var(--bp-mute)]">
            For contractors, trades and service businesses. Quotes, bookings and schedules that run
            on their own, built by someone who has run a service business.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BookCall where="hero" className="bp-btn bp-btn-hi">
              Start a project
            </BookCall>
            <Link href="#work" className="bp-btn bp-btn-ghost">
              Roll the work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

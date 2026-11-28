import Link from "next/link";
import Reveal from "../Reveal";
import { aboutPage, founderCta } from "@/lib/content";

/*
  Where the page ends.

  **It used to end on a GitHub screenshot.** Measured at 1440 before this
  rebuild, /about ran 5.6 screens, carried five links in the whole page
  body and no buttons at all: somebody who read the story and was
  persuaded had nothing to press. This is the other half of that fix, the
  hero being the first.

  The words are `founderCta`, which this page has always rendered.

  The link goes off this page, since nothing here renders the form: a bare
  `#contact` would change the hash and do nothing, which is the dead end
  the per-route test in `e2e/smoke.spec.ts` exists to catch.
*/
export default function AboutCta() {
  return (
    <section id="start" className="relative py-16 md:py-20">
      <Reveal className="mx-auto max-w-6xl px-6">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
          {aboutPage.cta.eyebrow}
        </p>
        <h2 className="display mt-3 max-w-[28ch] text-2xl text-ink sm:text-3xl md:text-4xl">
          {founderCta.headline}
        </h2>
        <p className="mt-4 max-w-[56ch] text-[1rem] leading-relaxed text-muted">
          {founderCta.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/?offer=call#contact"
            data-offer="call"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {founderCta.buttonLabel}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              →
            </span>
          </Link>
          {/* **One button, deliberately.** A second door to `/services`
              sat here; Meg's instruction on Nov 28 was that somebody who
              finishes this page should have one obvious next action and
              that it must not be a price list. Two buttons is a choice,
              and a choice is the thing a persuaded reader does not need.
              `/services` is one click away in the header on every width,
              including the phone menu. */}
        </div>
      </Reveal>
    </section>
  );
}

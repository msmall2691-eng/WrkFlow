import Reveal from "../Reveal";
import { aboutPage, approachSteps } from "@/lib/content";

/*
  How a project runs, which is the link the homepage sends here for
  (`homeBands.approach.link`, on `StageApproach`). The `#approach` anchor
  is load-bearing: the footer and ⌘K both point at `/about#approach`.

  **Three changes from the version this replaces.**

  *The copy moved into `lib/content.ts`.* The heading and the line under
  it were literals inside `components/Approach.tsx`, which made this the
  one page on the site with visitor-facing copy outside that file.

  *The connector animation is gone.* It was a teal fill drawing along a
  hairline between the four cards, driven by its own IntersectionObserver
  and its own state. It animated a gradient's position rather than
  transform or opacity, it was a second motion system on a page that now
  reveals its sections like every other, and at 390px it rendered as four
  short vertical ticks nobody reads as a flow. The steps are numbered;
  the numbers are the sequence.

  *Nothing closes the section.* A `studioStats` row did, and the note at
  the foot of this file records why it came out: it carried a dollar
  figure on a page Meg has asked to keep money off, and it repeated
  step 04.

  The reef band that opened this section is gone; the note beside the
  step list says why, and how to put it back.
*/
export default function AboutProcess() {
  return (
    <section
      id="approach"
      className="relative border-b border-line bg-[var(--section-alt-bg)] py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
            {aboutPage.process.eyebrow}
          </p>
          <h2 className="display mt-3 text-2xl text-ink sm:text-3xl md:text-4xl">
            {aboutPage.process.heading}
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted">
            {aboutPage.process.lede}
          </p>
        </Reveal>

        {/*
          **The reef band came off this page on Nov 28 2026**, and it is
          the one cut here worth a second opinion. Meg's instruction that
          day was clean, concise, simple, and that where two layouts are
          possible the quieter one wins. Measured, the band was 490px of a
          1028px section and the single largest thing on /about that said
          nothing: it is beautiful and it is not evidence, on the page
          where a visitor is deciding whether to trust one person.

          It is a cut rather than a deletion. The clip, its poster and
          `LivingFrame`'s own reasoning are all still in the repo, and
          `/tools` still carries a frame, so putting it back is this
          comment turning back into four lines of JSX.
        */}

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {approachSteps.map((step, i) => (
            <li key={step.index}>
              <Reveal delay={i * 50} className="h-full">
                <div className="group h-full rounded-2xl border border-line bg-[color:var(--cp-fill)] p-6 transition-colors hover:border-signal/40">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line font-mono text-xs text-faint transition-colors group-hover:border-signal group-hover:text-signal">
                    {step.index}
                  </span>
                  <h3 className="display-serif mt-5 text-lg text-ink transition-colors group-hover:text-signal md:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/*
          **A `studioStats` row closed this section and came out on Nov 28
          2026.** Two reasons, and the first is not negotiable: one of the
          four promises is "$0 to scope · nothing binding", and Meg asked
          for money off this page until the shape of the site is settled.
          Rendering three of the four would have been a second author for
          a list `/services` already renders whole.

          The second is the same instruction's other half. The four steps
          above already say the thing a buyer is checking, step 04 in so
          many words: the files, the database, the domain and the keys go
          with it. Saying it again underneath was the page being thorough
          where it should have been short.
        */}
      </div>
    </section>
  );
}

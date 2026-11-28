import Reveal from "../Reveal";
import LivingFrame from "../ocean/LivingFrame";
import { aboutPage, approachSteps, studioStats } from "@/lib/content";

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

  *`studioStats` closes the section.* The four promises are M Studio's
  own commitments, already rendered beside the price on /pricing, and
  they are the other half of what somebody deciding about a solo founder
  wants: what happens if this does not work out. Step 04 already says the
  files, database, domain and keys go with it; the row says it in the
  form a buyer checks.

  The reef band is Meg's own clip and the page's only moving thing.
  `LivingFrame` pauses it off-screen and never mounts it at all under
  `prefers-reduced-motion`, where the poster is a real `<img>` underneath.
*/
export default function AboutProcess() {
  return (
    <section
      id="approach"
      className="relative border-b border-line bg-[var(--section-alt-bg)] py-16 md:py-20"
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

        {/* Under the heading rather than above it, which is the shape
            /tools already uses: a title, then the art full width. Opening
            the band on half a screen of water pushed the words this
            section exists for below the fold. */}
        <LivingFrame
          video="/ocean/reef-band.mp4"
          poster="/ocean/reef-band-poster.webp"
          alt="A slow drift across a deep reef at night, past an anemone, a turtle and shoals of lit fish."
          className="mt-10"
        />

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

        <Reveal className="mt-12 border-t border-line pt-8" delay={60}>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
            {aboutPage.process.promises}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {studioStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="block font-mono text-xl leading-none text-ink sm:text-2xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-xs leading-snug text-faint">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

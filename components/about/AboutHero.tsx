import Image from "next/image";
import Link from "next/link";
import StackedHeading from "../StackedHeading";
import Reveal from "../Reveal";
import { aboutPage, founderNote, provingGround } from "@/lib/content";

/*
  /about opens.

  **It used to open on a centered photograph in a 2xl column**, with the
  page's own title four hundred pixels below it and the first thing a
  persuaded reader could click another two thousand below that. Measured
  at 1440, the whole page body carried five links and no buttons. This is
  the half of that worth fixing first: the title, the one sentence under
  it, and somewhere to go, all on the first screen, with the face beside
  them rather than above them.

  **The portrait is the existing pair, unchanged.** Two renderings of one
  photograph with only ever one in the accessibility tree — `globals.css`
  has the measurements for why Harbor gets the cut-out and cream gets the
  circle, and `.cp-inner` keeps the cut on this page in both themes
  because the page is near-black in both. `priority`, because this really
  is the first image on the page and lazy-loading it is a grey hole on
  arrival.

  **The numbers are `provingGround` and they render with its label.** They
  are The Maine Cleaning Co's operating history, not client results, and
  the attribution is part of the data rather than a caption somebody can
  drop. Nothing here is typed by hand: the array is mapped.
*/
export default function AboutHero() {
  return (
    <section id="top" className="relative border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
              {aboutPage.hero.eyebrow}
            </p>
            <StackedHeading
              as="h1"
              className="mt-5"
              lead={aboutPage.hero.headlineLead}
              trail={aboutPage.hero.headlineTrail}
            />
            <p className="mt-6 max-w-[46ch] text-lg font-medium text-ink sm:text-xl">
              {founderNote.headlineFollow}
            </p>
            <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-muted">
              {founderNote.paragraphs[0]}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/*
                `bg-signal text-white` is the pair `.cp-inner` answers with
                the design's own solid button, paper under near-black ink.
                Written as the pair rather than as a hex for the reason
                recorded beside that rule: a hardcoded label is how a
                button goes white-on-teal the next time the accent moves.
              */}
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {aboutPage.hero.primary}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                >
                  →
                </span>
              </a>
              <Link
                href="#proof"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--cp-hairline-strong)] px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-signal/50 hover:text-signal"
              >
                {aboutPage.hero.secondary}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                >
                  ↓
                </span>
              </Link>
            </div>

            <p className="mt-6 text-sm text-faint">
              {aboutPage.hero.location}
            </p>
          </Reveal>

          <Reveal className="md:col-span-5" delay={80}>
            <div className="relative flex justify-center md:justify-end">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70 blur-2xl"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in srgb, var(--color-signal) 20%, transparent), transparent)",
                }}
              />
              <Image
                src="/meg-cutout.webp"
                alt="Meg, founder of M Studio"
                width={1047}
                height={1290}
                priority
                sizes="(max-width: 768px) 15rem, 24rem"
                className="founder-cut relative h-60 w-auto sm:h-80 md:h-96"
              />
              <Image
                src="/meg.webp"
                alt="Meg, founder of M Studio"
                width={1047}
                height={1290}
                sizes="(max-width: 768px) 11rem, 14rem"
                className="founder-round relative h-44 w-44 rounded-full object-cover object-top ring-1 ring-line sm:h-56 sm:w-56"
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* The operating history, attributed, on its own rule under the
          whole hero rather than tucked under the photograph: it is the
          first question a visitor asks and it deserves the full width. */}
      <Reveal className="border-t border-line" delay={120}>
        <div className="mx-auto max-w-6xl px-6 py-7">
          <p className="text-sm text-muted">{provingGround.label}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {provingGround.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="block font-mono text-2xl leading-none text-ink sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-xs leading-snug text-faint">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}

import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";

/*
  FounderNote — an editorial "meet the founder" section. Portrait +
  identity block + small credibility chips on the left, personal note on
  the right. The note opens with a big serif quote glyph and closes with
  a handwritten "— Meg" signature so it reads as a signed letter.
*/

const QUICK_FACTS = [
  "USM · Business Analytics & AI",
  "Comp Sci minor",
  "Founded The Maine Cleaning Co.",
];

export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-line bg-base pt-16 pb-20 md:pt-24 md:pb-24">
      {/* Live "harbor water" — fills to the real Portland tide level (accent → re-tunes with theme) */}
      <TideLevel />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-12">
          {/* Portrait + identity + quick facts */}
          <div className="md:col-span-4 md:sticky md:top-24">
            <Reveal>
              <figure className="flex flex-col items-center text-center md:items-start md:text-left">
                <FounderAvatar className="aspect-square w-36 rounded-full shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)] ring-2 ring-signal/30 grayscale transition-[filter] duration-700 hover:grayscale-0 sm:w-40" />
                <figcaption className="mt-4">
                  <p className="font-display text-lg text-ink">Meg</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-faint">
                    Founder · M Studio
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint/80">
                    Portland, Maine
                  </p>
                  {/* Credibility chips — small, mono, quiet */}
                  <ul className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start">
                    {QUICK_FACTS.map((f) => (
                      <li
                        key={f}
                        className="whitespace-nowrap rounded-full border border-line bg-surface/60 px-2.5 py-1 font-mono text-[10px] leading-none text-muted"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Note — eyebrow, open-quote glyph, emphasized lead, supporting paragraphs, signature */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                Meet the founder
              </p>
            </Reveal>
            <Reveal delay={120}>
              <blockquote className="relative mt-4 [font-family:var(--font-serif)] text-ink">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 left-0 select-none text-[6rem] leading-none text-signal/25 md:-left-4 md:-top-10"
                >
                  &ldquo;
                </span>
                <p className="relative text-balance text-xl leading-snug md:text-2xl">
                  {founderNote.lead}
                </p>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-muted md:text-lg">
                  {founderNote.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <p
                  className="mt-6 text-4xl leading-none text-signal"
                  style={{ fontFamily: "var(--font-hand)" }}
                >
                  — Meg
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Quiet key down by the water it labels */}
        <div className="mt-12 flex justify-center md:justify-start">
          <TideKey />
        </div>
      </div>
    </section>
  );
}

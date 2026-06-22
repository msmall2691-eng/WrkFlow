import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";

/*
  FounderNote — a clean, neutral-dark "meet the founder" section that flows out
  of the hero and works under any accent (the only color is the accent itself,
  via the tide water + ring, so it re-tunes with the theme). Circular portrait,
  emphasized lead. Wording is left exactly as authored — only the first sentence
  is pulled out for rhythm.
*/

const splitAt = founderNote.indexOf(". ") + 1;
const lead = founderNote.slice(0, splitAt).trim();
const rest = founderNote.slice(splitAt).trim();

export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-line bg-base pt-16 pb-28 md:pt-24 md:pb-36">
      {/* Live "harbor water" — fills to the real Portland tide level (accent → re-tunes with theme) */}
      <TideLevel />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Quiet key so the rising "water" reads as the live tide */}
        <div className="mb-10 flex justify-end">
          <TideKey />
        </div>

        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          {/* Circular portrait + identity caption */}
          <div className="md:col-span-4">
            <Reveal>
              <figure className="flex flex-col items-center text-center md:items-start md:text-left">
                <FounderAvatar className="aspect-square w-36 rounded-full shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)] ring-2 ring-signal/30 grayscale transition-[filter] duration-700 hover:grayscale-0 sm:w-40" />
                <figcaption className="mt-4">
                  <p className="font-display text-lg text-white">Meg</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-faint">
                    Founder · M Studio
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Note — eyebrow, emphasized lead, supporting text */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                Meet the founder
              </p>
            </Reveal>
            <Reveal delay={120}>
              <blockquote className="mt-4 [font-family:var(--font-serif)] text-white">
                <span className="block text-balance text-xl leading-snug md:text-2xl">
                  {lead}
                </span>
                <span className="mt-4 block text-base leading-relaxed text-muted md:text-lg">
                  {rest}
                </span>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

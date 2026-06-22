import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideWave from "./TideWave";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";

/*
  FounderNote — a clean, dark "meet the founder" section that flows straight out
  of the hero (no jarring color band, no heavy waves). Editorial two-column
  layout: a prominent portrait + an emphasized lead sentence. Wording is left
  exactly as authored — only the first sentence is pulled out for rhythm.
*/

// Split off the opening sentence as a lead, without changing any words.
const splitAt = founderNote.indexOf(". ") + 1;
const lead = founderNote.slice(0, splitAt).trim();
const rest = founderNote.slice(splitAt).trim();

export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-line bg-[#112a3a] pt-16 pb-28 md:pt-24 md:pb-36">
      {/* Tide-driven accent wave at the top (symmetry with the water below) */}
      <TideWave />
      {/* Live "harbor water" — fills to the real Portland tide level */}
      <TideLevel />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Quiet key so the rising "water" reads as the live tide */}
        <div className="mb-8 flex justify-end">
          <TideKey />
        </div>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          {/* Portrait + identity caption */}
          <div className="md:col-span-4">
            <Reveal>
              <figure className="text-center md:text-left">
                <FounderAvatar className="mx-auto aspect-[4/5] w-full max-w-[220px] rounded-2xl shadow-[0_22px_50px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/12 grayscale transition-[filter] duration-700 hover:grayscale-0 md:mx-0 md:max-w-[260px]" />
                <figcaption className="mt-5">
                  <p className="font-display text-xl text-white">Meg</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-faint">
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

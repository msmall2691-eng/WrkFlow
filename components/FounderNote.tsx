import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import WaveDivider from "./WaveDivider";

/*
  FounderNote — a deep slate-teal mid-tone "breather" between the dark hero and
  the dark run below. Not bright, so it flows out of the hero, but light enough
  to give the tide-driven waves contrast. Editorial two-column layout.
  Wording is left exactly as authored — only the first sentence is pulled out.
*/

// Split off the opening sentence as a lead, without changing any words.
const splitAt = founderNote.indexOf(". ") + 1;
const lead = founderNote.slice(0, splitAt).trim();
const rest = founderNote.slice(splitAt).trim();

export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-y border-white/10 bg-[#163a44] py-16 text-ink md:py-24">
      {/* Tide-driven waves — dark sections above/below lapping the mid-tone band */}
      <WaveDivider position="top" fill="#08131d" />
      <WaveDivider position="bottom" fill="#0b1722" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          {/* Portrait + identity caption */}
          <div className="md:col-span-4">
            <Reveal>
              <figure className="text-center md:text-left">
                <FounderAvatar className="mx-auto aspect-[4/5] w-full max-w-[220px] rounded-2xl shadow-[0_22px_50px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/15 grayscale transition-[filter] duration-700 hover:grayscale-0 md:mx-0 md:max-w-[260px]" />
                <figcaption className="mt-5">
                  <p className="font-display text-xl text-white">Meg</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[#8aa6ad]">
                    Founder · M Studio
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Note — eyebrow, emphasized lead, supporting text */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6fd3c6]">
                Meet the founder
              </p>
            </Reveal>
            <Reveal delay={120}>
              <blockquote className="mt-4 [font-family:var(--font-serif)] text-white">
                <span className="block text-balance text-xl leading-snug md:text-2xl">
                  {lead}
                </span>
                <span className="mt-4 block text-base leading-relaxed text-[#c2d3d8] md:text-lg">
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

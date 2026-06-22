import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import WaveDivider from "./WaveDivider";

/*
  FounderNote — the one LIGHT section ("fog slate") that breaks the dark run.
  Cool, not warm: fog-slate field, deep-slate ink, Meg signed + photo-ready.
*/
export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-y border-black/10 bg-[#c7d5dd] py-16 text-[#16384a] md:py-24">
      {/* Ocean waves lapping the light band — matched to the dark sections above/below */}
      <WaveDivider position="top" fill="#08131d" />
      <WaveDivider position="bottom" fill="#0b1722" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
          {/* Photo */}
          <div className="md:col-span-4">
            <Reveal>
              <FounderAvatar className="mx-auto aspect-[4/5] w-full max-w-[132px] rounded-2xl shadow-[0_20px_50px_-24px_rgba(11,23,34,0.45)] ring-1 ring-black/10 grayscale transition-[filter] duration-700 hover:grayscale-0 md:mx-0" />
            </Reveal>
          </div>

          {/* Note */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <blockquote className="[font-family:var(--font-serif)] text-base leading-relaxed text-[#16384a] md:text-lg">
                {founderNote}
              </blockquote>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 font-mono text-sm text-[#16384a]">
                — Meg <span className="text-[#5b7480]">· Founder, M Studio</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

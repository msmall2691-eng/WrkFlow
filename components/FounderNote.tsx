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
    <section className="relative overflow-hidden border-y border-black/10 bg-[#c7d5dd] py-20 text-[#16384a] md:py-28">
      {/* Ocean waves lapping the light band — matched to the dark sections above/below */}
      <WaveDivider position="top" fill="#08131d" />
      <WaveDivider position="bottom" fill="#0b1722" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          {/* Photo — the focal element */}
          <div className="md:col-span-5">
            <Reveal>
              <FounderAvatar className="mx-auto aspect-[4/5] w-full max-w-[300px] rounded-2xl shadow-[0_24px_60px_-24px_rgba(11,23,34,0.45)] ring-1 ring-black/10 md:mx-0" />
            </Reveal>
          </div>

          {/* Note */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#3a5a6b]">
                // From the founder
              </p>
            </Reveal>
            <Reveal delay={80}>
              <blockquote className="[font-family:var(--font-serif)] text-xl leading-relaxed text-[#16384a] md:text-2xl">
                {founderNote}
              </blockquote>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 font-mono text-sm text-[#16384a]">
                — Meg <span className="text-[#5b7480]">· Founder, M Studio</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

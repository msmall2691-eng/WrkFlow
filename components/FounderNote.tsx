import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";

/*
  FounderNote — the one LIGHT section ("fog slate") that breaks the dark run.
  Cool, not warm: fog-slate field, deep-slate ink, Meg signed + photo-ready.
*/
export default function FounderNote() {
  return (
    <section className="relative border-y border-black/10 bg-[#c7d5dd] py-16 text-[#16384a] md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#3a5a6b]">
                // From the founder
              </p>
            </Reveal>
            <Reveal delay={120}>
              {/* Drop a square photo at public/meg.jpg and it replaces the monogram. */}
              <div className="flex items-center gap-4">
                <FounderAvatar />
                <div>
                  <p className="font-display text-lg text-[#16384a]">Meg</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#5b7480]">
                    Founder · M Studio
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="text-xl leading-relaxed text-[#16384a] md:text-2xl">
                {founderNote}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 font-mono text-sm text-[#16384a]">
                — Meg <span className="text-[#5b7480]">· Founder, M Studio</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

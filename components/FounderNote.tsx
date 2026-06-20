import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";

export default function FounderNote() {
  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="marker mb-6">// From the founder</p>
            </Reveal>
            <Reveal delay={120}>
              {/* Swap the monogram for a real photo when ready:
                  <img src="/meg.jpg" alt="Meg, founder of M Studio" className="h-16 w-16 rounded-full object-cover" /> */}
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-signal/40 bg-signal/10 font-display text-2xl text-signal"
                >
                  M
                </span>
                <div>
                  <p className="font-display text-lg text-ink">Meg</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
                    Founder · M Studio
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="text-xl leading-relaxed text-ink md:text-2xl">
                {founderNote}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 font-mono text-sm text-muted">
                — Meg <span className="text-faint">· Founder, M Studio</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

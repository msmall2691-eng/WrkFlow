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
          </div>
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="text-xl leading-relaxed text-ink md:text-2xl">
                {founderNote}
              </p>
            </Reveal>
            <Reveal delay={160}>
              {/* Owner: add a name + one-line title here when ready. */}
              <p className="mt-8 font-mono text-xs uppercase tracking-widest text-faint">
                Founder, mLinx Studio
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

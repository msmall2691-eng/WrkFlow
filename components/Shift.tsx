import { whoIsItFor } from "@/lib/content";
import Reveal from "./Reveal";
import RentedVsBuilt from "./RentedVsBuilt";

/*
  The Shift — the "why now" intro. One tight statement + one lead, the
  interactive rent-vs-build flip, and who it's for. No repetition.
*/
export default function Shift() {
  return (
    <section id="shift" className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
      {/* Soft landing from the dark hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--color-surface)] to-transparent"
      />
      {/* Soft accent glow — drifts gently */}
      <div
        aria-hidden="true"
        className="floaty pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-signal/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <Reveal>
            <p className="marker mb-4">// Why now</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              What we love: helping you{" "}
              <span className="text-signal">build</span> the custom websites, tools,
              and systems that fit exactly how you work.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Designing the site, building the tools, automating the busywork,
              tuning the systems—that&apos;s the work we love, and it makes your day
              easier, not busier. It used to mean renting rigid software or hiring a
              dev team you couldn&apos;t justify. Now a small studio on the Maine
              coast builds exactly what you need—and hands you the keys. We know it
              works; we built ours first.
            </p>
          </Reveal>
        </div>

        <RentedVsBuilt />

        {/* Who it's for */}
        <Reveal delay={120}>
          <div className="mt-12 border-t border-line pt-8">
            <p className="marker mb-4">// Who it&apos;s for</p>
            <p className="display-serif max-w-3xl text-xl leading-snug text-ink sm:text-2xl">
              {whoIsItFor}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

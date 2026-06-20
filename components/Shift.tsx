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
            <p className="marker mb-4">// The shift</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              For the first time, you can{" "}
              <span className="text-signal">own</span> the systems your business
              runs on.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              For years the deal was lopsided—rent your software, bend to its forms,
              pay per seat forever. That math has changed: clean websites, linked
              systems, and real automation are finally within reach of a small, sharp
              studio. We know—we built it for our own company first.
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

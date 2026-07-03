import { approachSteps } from "@/lib/content";
import Reveal from "./Reveal";
import Watermark from "./Watermark";

/*
  Approach — the four-step process, rendered as small connected cards.
  On desktop, a hairline connector spans the top of the row; on mobile, a
  short vertical connector runs between each card, so the sequence reads
  as one linked path either way.
*/
export default function Approach() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden border-t border-line bg-[#0e1d2b] py-14 md:py-20"
    >
      <Watermark text="M STUDIO" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              No black boxes. You steer the whole build.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              You see the work as it takes shape, change course whenever, and walk
              away owning it. No dependency by design.
            </p>
          </Reveal>
        </div>

        {/* Connected stepper */}
        <div className="relative">
          {/* Desktop hairline connector along the top of the row */}
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-11 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent md:block"
          />
          <div className="flex flex-col md:grid md:grid-cols-4 md:gap-5">
            {approachSteps.map((step, i) => (
              <div key={step.index}>
                <Reveal delay={i * 80}>
                  <div className="group relative rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/40 hover:bg-surface/70 hover:shadow-[0_20px_50px_-30px_rgba(22,163,148,0.5)] active:scale-[0.99] md:h-full">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-base font-mono text-xs text-faint transition-all duration-300 group-hover:border-signal group-hover:bg-signal/10 group-hover:text-signal">
                      {step.index}
                    </span>
                    <h3 className="display-serif mt-5 text-lg text-ink transition-colors group-hover:text-signal md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
                {/* Mobile vertical connector between cards */}
                {i < approachSteps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="mx-11 my-2 h-6 w-px bg-gradient-to-b from-line via-line/60 to-transparent md:hidden"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

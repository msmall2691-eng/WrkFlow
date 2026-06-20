import { approachSteps } from "@/lib/content";
import Reveal from "./Reveal";
import Watermark from "./Watermark";

export default function Approach() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden border-t border-line py-16 md:py-24"
    >
      <Watermark text="LINX" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <p className="marker mb-4">// How we work</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              Draft-first. You stay in control the whole way.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              No black boxes and no dependency by design. You see the work as it
              takes shape, steer it at every step, and walk away owning it
              outright.
            </p>
          </Reveal>
        </div>

        {/* Connected stepper — the four steps linked on one line */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-1 top-5 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent md:block"
          />
          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {approachSteps.map((step, i) => (
              <Reveal key={step.index} delay={i * 80}>
                <div className="group relative">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

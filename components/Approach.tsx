import { approachSteps } from "@/lib/content";
import Reveal from "./Reveal";

export default function Approach() {
  return (
    <section
      id="approach"
      className="relative border-t border-line py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <p className="marker mb-6">// How we work</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
              Draft-first. You stay in control the whole way.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              No black boxes and no dependency by design. You see the work as it
              takes shape, steer it at every step, and walk away owning it
              outright.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
          {approachSteps.map((step, i) => (
            <Reveal key={step.index} delay={i * 80}>
              <div className="flex h-full flex-col bg-surface p-7">
                <span className="font-mono text-xs text-signal">
                  {step.index}
                </span>
                <h3 className="mt-5 font-display text-xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

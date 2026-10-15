"use client";

import { useEffect, useRef, useState } from "react";
import { approachSteps } from "@/lib/content";

/*
  Approach — the four-step process, rendered as small connected cards.
  On desktop, a hairline connector spans the top of the row; on mobile,
  short vertical connectors run between each pair. In both cases a
  signal-teal fill DRAWS ACROSS the connector when the section enters
  view, so the whole thing reads as one connected workflow.
*/
export default function Approach() {
  const [drawn, setDrawn] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = flowRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="approach"
      className="relative overflow-hidden border-t border-line bg-[var(--section-alt-bg)] py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
                      <p className="mb-3 text-xs font-medium text-signal">
              Approach
            </p>
                      <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              No black boxes. You steer the whole build.
            </h2>
                      <p className="mt-5 text-[1rem] leading-relaxed text-muted">
              You see it as it takes shape. You own it. No lock-in.
            </p>
        </div>

        {/* Connected stepper */}
        <div
          ref={flowRef}
          className={`workflow-flow relative ${drawn ? "is-drawing" : ""}`}
        >
          {/* Desktop hairline connector along the top of the row + signal fill */}
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-11 hidden h-px overflow-hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-line to-transparent" />
            <div className="workflow-fill absolute inset-0 bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
          </div>

          <div className="flex flex-col md:grid md:grid-cols-4 md:gap-5">
            {approachSteps.map((step, i) => (
              <div key={step.index}>
                                  <div className="group corner-accents relative rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/40 hover:bg-surface/70 hover:shadow-[0_20px_50px_-30px_rgba(22,163,148,0.5)] active:scale-[0.99] md:h-full">
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
                {/* Mobile vertical connector between cards + signal fill */}
                {i < approachSteps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="relative mx-11 my-2 h-6 w-px overflow-hidden md:hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-line via-line/60 to-transparent" />
                    <div
                      className="workflow-fill-v absolute inset-0 bg-gradient-to-b from-signal/60 to-signal/10"
                      style={{ transitionDelay: `${i * 0.18}s` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

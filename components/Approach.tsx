"use client";

import { useEffect, useRef, useState } from "react";
import { approachSteps } from "@/lib/content";
import CastFrame from "./ocean/CastFrame";

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
        {/*
          **The reef, uncaptioned, as this section's own picture.** /about
          was 3.8 screens with one image on it, Meg's photograph, and this
          section and the stack under it carried none at all.

          It is the reef rather than a creature because this section is not
          one of the four services, and CastFrame's rule is that a caption
          is what makes a picture a service's marker. It is also the right
          picture rather than a convenient one: the homepage annotates this
          exact image to argue that a reef has no manager, that each
          organism's output is the next one's input and the whole thing
          runs unsupervised. This section is about how a build is run with
          nothing hidden in it. Same argument, one page over, so the band
          carries no words and the heading under it does the talking.

          A 21/9 crop rather than the panel's 16/9: at full container width
          a 16/9 band is most of a screen of water before the first step,
          which would push the content this page exists for below the fold.
        */}
        <CastFrame
          art="/ocean/reef.webp"
          artAlt="A deep reef at night: an octopus on the rocks, shoals of lit fish, anemones and a shaft of light from the surface."
          aspect="aspect-[21/9]"
          sizes="(min-width: 1024px) 1152px, 100vw"
          className="mb-12"
        />
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

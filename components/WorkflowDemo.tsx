"use client";

import { Fragment, useEffect, useRef, useState } from "react";

/*
  WorkflowDemo — a small always-looping node illustration that says "this
  is what a workflow looks like." Four labeled nodes with dashed connectors
  and a pulse dot flowing along each line, staggered so the signal reads as
  data moving down the pipeline. Uses the existing .flow-line and
  .travel-dot animations from globals.css, both already reduced-motion aware.
*/
export type WorkflowStage = { icon: string; label: string };

const STAGES: WorkflowStage[] = [
  { icon: "📝", label: "Form" },
  { icon: "🗂️", label: "CRM" },
  { icon: "📧", label: "Email" },
  { icon: "🔔", label: "Notify" },
];

/* `stages` lets a case study pass its own chain for "How it works" — the
   generic Form/CRM/Email/Notify default stays for the marketplace page. */
export default function WorkflowDemo({
  stages = STAGES,
}: {
  stages?: WorkflowStage[];
}) {
  /*
    The pulse loops, so it has to stop. `is-live` is what un-pauses it (see
    `.flow-track:not(.is-live)` in globals.css): off-screen, the diagram is
    parked rather than compositing forever behind the fold. Default false, so
    a visitor who never scrolls here never pays for it.
  */
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* No IO means no way to pause it, so leave it running rather than
       shipping a diagram that is permanently frozen. */
    if (typeof IntersectionObserver === "undefined") {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="corner-accents rounded-2xl border border-line bg-surface/60 p-6 md:p-8"
    >
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          return (
            <Fragment key={stage.label}>
              <div className="flex shrink-0 flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/40 bg-base text-xl shadow-[inset_0_0_18px_-4px_var(--color-signal-glow)] md:h-14 md:w-14 md:text-2xl">
                  {stage.icon}
                </span>
                <span className="mt-2 text-xs text-faint">
                  {stage.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flow-track relative h-px flex-1 ${live ? "is-live" : ""}`}
                >
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 1"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="0.5"
                      x2="100"
                      y2="0.5"
                      stroke="var(--color-signal)"
                      strokeOpacity="0.4"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                      className="flow-line"
                    />
                  </svg>
                  <span
                    aria-hidden="true"
                    className="flow-pulse"
                    style={{ animationDelay: `${i * 0.7}s` }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

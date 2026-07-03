import { Fragment } from "react";

/*
  WorkflowDemo — a small always-looping node illustration that says "this
  is what a workflow looks like." Four labeled nodes with dashed connectors
  and a pulse dot flowing along each line, staggered so the signal reads as
  data moving down the pipeline. Uses the existing .flow-line and
  .travel-dot animations from globals.css, both already reduced-motion aware.
*/
const STAGES = [
  { icon: "📝", label: "Form" },
  { icon: "🗂️", label: "CRM" },
  { icon: "📧", label: "Email" },
  { icon: "🔔", label: "Notify" },
];

export default function WorkflowDemo() {
  return (
    <div className="corner-accents rounded-2xl border border-line bg-surface/60 p-6 md:p-8">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {STAGES.map((stage, i) => {
          const isLast = i === STAGES.length - 1;
          return (
            <Fragment key={stage.label}>
              <div className="flex shrink-0 flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/40 bg-base text-xl shadow-[inset_0_0_18px_-4px_var(--color-signal-glow)] md:h-14 md:w-14 md:text-2xl">
                  {stage.icon}
                </span>
                <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                  {stage.label}
                </span>
              </div>
              {!isLast && (
                <div className="relative h-px flex-1">
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
                    className="travel-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_10px_2px_var(--color-signal-glow)]"
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

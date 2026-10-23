import { Fragment } from "react";

/*
  The flow diagram's markup, with no client behaviour of its own.

  This was split out of WorkflowDemo because the homepage needs the picture
  and not the animation. WorkflowDemo is a client component (it runs an
  IntersectionObserver to park the pulse off-screen), so rendering it on the
  homepage added a hydration boundary for a diagram that does nothing: local
  median perf fell 92 to 88 and TBT rose from 86ms to 220ms.

  Nothing here uses state or effects, so this file has no "use client" and
  can render on the server when a server component asks for it, while
  WorkflowDemo still imports it for the animated case. One definition of
  what a flow diagram looks like, two ways to use it.
*/
export type WorkflowStage = { icon: string; label: string };

export default function WorkflowDiagram({
  stages,
  /*
    `false` draws the track parked (the CSS pauses the pulse when `is-live`
    is absent), `true` lets it run, and "still" leaves the pulse element out
    altogether — which is what the homepage uses, because CLAUDE.md allows
    two looping animations on the site and both are already spent.
  */
  live,
}: {
  stages: WorkflowStage[];
  live: boolean | "still";
}) {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-4">
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        return (
          <Fragment key={stage.label}>
            <div className="flex shrink-0 flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/40 bg-base text-xl shadow-[inset_0_0_18px_-4px_var(--color-signal-glow)] md:h-14 md:w-14 md:text-2xl">
                {stage.icon}
              </span>
              <span className="mt-2 text-xs text-faint">{stage.label}</span>
            </div>
            {!isLast && (
              <div
                className={`flow-track relative h-px flex-1 ${
                  live === true ? "is-live" : ""
                }`}
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
                {live !== "still" && (
                  <span
                    aria-hidden="true"
                    className="flow-pulse"
                    style={{ animationDelay: `${i * 0.7}s` }}
                  />
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

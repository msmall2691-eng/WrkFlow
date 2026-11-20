"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { planets, SPLINE_VH, SPLINE_VH_MOBILE } from "@/lib/planets";

/*
  The journey: the wordmark, then the flight past the project planets.

  **This is the spec's shape rather than two features glued together.**
  The prompt puts the particle logo at the start of the camera's path and
  flies away from it, which is why the wordmark sits on the spline at
  z = 7 and not in a scene of its own. One camera, one path, one scroll.

  **The scroll length is one constant and it is the one number in this
  spec that fights Meg's own brief.** `SPLINE_VH` is the prompt's 600,
  which puts the first price on this site somewhere around screen seven;
  her first instruction about this page was that it was "hard to see what
  is for sale that's tangible". Built as specified, named so it is one
  edit, and said out loud rather than quietly halved.
*/

const VesperStage = dynamic(() => import("./VesperStage"), { ssr: false });
const CaseModal = dynamic(() => import("./CaseModal"), { ssr: false });

export default function VesperJourney({ word }: { word: string }) {
  const section = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [near, setNear] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [vh, setVh] = useState(SPLINE_VH);

  useEffect(() => {
    const wide = window.matchMedia("(max-width: 767px)");
    const sync = () => setVh(wide.matches ? SPLINE_VH_MOBILE : SPLINE_VH);
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, []);

  /*
    Scroll position as a 0..1 along the section, written to a ref rather
    than to state: the camera reads it every frame, and re-rendering React
    sixty times a second to move a camera is how a scene like this ends up
    janky on the machine it was not written on.
  */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      progress.current = travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [vh]);

  const active = near === null ? null : planets[near];

  return (
    <div ref={section} className="relative" style={{ height: `${vh}svh` }}>
      {/* The canvas is fixed for the length of the section, so the page
          scrolls and the scene holds still in front of it. */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <VesperStage word={word} progress={progress} onNear={setNear} />

        {/*
          The planet overlay. A real project with a real link: the planet
          is a way of arriving at a case study, not a claim in itself.
        */}
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-6xl items-end px-6 pb-24">
            <div
              className={`pointer-events-auto max-w-md rounded-2xl border border-white/12 bg-[rgba(10,10,15,0.82)] p-6 backdrop-blur-md transition-all duration-500 ${
                active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              aria-hidden={active ? undefined : true}
            >
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[#2dd4bf]">
                {active?.tag ?? ""}
              </p>
              <h2 className="m-0 mt-2 font-serif text-[1.9rem] leading-tight text-white">
                {active?.title ?? ""}
              </h2>
              {active ? (
                <button
                  type="button"
                  onClick={() => setOpen(near)}
                  className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-white/25 px-5 text-[14px] font-medium text-white transition-colors duration-150 hover:border-white/60"
                >
                  View case <span aria-hidden="true">&nbsp;→</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: the case transition. Mounted only once something is
          open, so its canvas does not exist on an untouched page. */}
      {open !== null ? (
        <CaseModal planet={planets[open]} onClose={() => setOpen(null)} />
      ) : null}
    </div>
  );
}

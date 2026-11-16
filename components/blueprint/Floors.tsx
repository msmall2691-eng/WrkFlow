"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { approachSteps } from "@/lib/content";

/*
  Floors: how a project gets built, told the way Ironline Builders tells a
  building going up. Every step is a floor. A floor counter down the left
  lights the one you are on, and a drawing on the right goes from survey
  lines, to a frame, to wiring, to a finished screen as you climb.

  The step names and bodies are `approachSteps` from lib/content.ts. The
  headline over each (the construction metaphor) is the only copy written
  here.
*/

const HEADS = [
  { head: "First we walk the site.", sub: "Where the time goes" },
  { head: "Then the drawings.", sub: "Nothing built before you sign" },
  { head: "Then it goes up.", sub: "Piece by piece, you can poke at it" },
  { head: "Then you move in.", sub: "Tuned on real use, yours to keep" },
];

function Drawing({ level }: { level: number }) {
  // level 0..3: survey, frame, wiring, finished.
  return (
    <div className="bp-drawing" aria-hidden="true">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <g className="bp-draw-l" data-on={level >= 0}>
          <rect x="10" y="10" width="380" height="260" fill="none" strokeDasharray="6 6" />
          <line x1="10" y1="290" x2="390" y2="290" />
          <text x="170" y="285">1440 × 900</text>
          <circle cx="40" cy="60" r="4" />
          <circle cx="360" cy="230" r="4" />
        </g>
        <g className="bp-draw-l" data-on={level >= 1}>
          <rect x="10" y="10" width="380" height="26" fill="none" />
          <rect x="24" y="52" width="230" height="96" fill="none" />
          <rect x="268" y="52" width="108" height="96" fill="none" />
          <rect x="24" y="162" width="110" height="90" fill="none" />
          <rect x="145" y="162" width="110" height="90" fill="none" />
          <rect x="266" y="162" width="110" height="90" fill="none" />
        </g>
        <g className="bp-draw-l bp-draw-hi" data-on={level >= 2}>
          <path d="M79 207 C 120 150, 160 150, 200 207 S 280 260, 321 207" fill="none" />
          <circle cx="79" cy="207" r="5" />
          <circle cx="200" cy="207" r="5" />
          <circle cx="321" cy="207" r="5" />
          <path d="M322 100 L 322 162" fill="none" strokeDasharray="4 4" />
        </g>
      </svg>
      <div className="bp-drawing-shot" data-on={level >= 3}>
        <Image src="/shots/maineclean.webp" alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

export default function Floors() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.floor));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section aria-labelledby="floors-h" className="bp-plan relative">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 lg:px-10">
        <p className="bp-eyebrow"><span className="text-[color:var(--bp-print)]">[ 03 ]</span> How it gets built</p>
        <h2 id="floors-h" className="bp-h2 mt-4">
          Built floor by floor.
          <span className="bp-serif block text-[color:var(--bp-print)] normal-case">You watch it go up.</span>
        </h2>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 pt-10 lg:grid-cols-12 lg:px-10">
        {/* Floor counter */}
        <div className="hidden lg:col-span-1 lg:block">
          <ol className="bp-elevator sticky top-[30vh]" aria-hidden="true">
            {[...approachSteps].reverse().map((s) => {
              const i = Number(s.index) - 1;
              return (
                <li key={s.index} data-on={i === active} data-done={i < active}>
                  {s.index}
                </li>
              );
            })}
            <li className="bp-elevator-grade">Grade</li>
          </ol>
        </div>

        <div className="lg:col-span-5">
          {approachSteps.map((s, i) => (
            <article
              key={s.index}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-floor={i}
              className="bp-floor"
            >
              <p className="bp-floor-num" aria-hidden="true">{s.index}</p>
              <p className="bp-log-chip">
                Floor {pad(i + 1)} <span aria-hidden="true">•</span> {s.title} <span aria-hidden="true">•</span> {HEADS[i]?.sub}
              </p>
              <h3 className="bp-floor-h">{HEADS[i]?.head ?? s.title}</h3>
              <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[color:var(--bp-mute)]">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-[18vh]">
            <Drawing level={active} />
            <p className="mt-3 font-mono text-[11px] text-[color:var(--bp-mute)]">
              Sheet {pad(active + 1)} of {pad(approachSteps.length)} · {approachSteps[active]?.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

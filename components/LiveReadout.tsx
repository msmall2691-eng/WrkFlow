"use client";

import { useState } from "react";
import MaineReadout from "./MaineReadout";

/*
  LiveReadout — the hero's live Portland telemetry, front and center, with a
  tap-to-open explainer of what the site actually does with that data. Makes
  the "this runs on live Maine data" idea obvious instead of hidden.
*/
const ITEMS: { k: string; v: string }[] = [
  { k: "Glow", v: "the hero glow tracks the weather — brighter on clear days, moodier when it's grey" },
  { k: "Waves", v: "the waves by the founder note speed up as the tide comes in, slow as it goes out" },
  { k: "Sky", v: "golden hour and the moon phase show up live in the line above" },
  { k: "Theme", v: "set the accent to follow Maine's daylight — dawn → midday → dusk (Theme picker, bottom-right)" },
];

export default function LiveReadout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Show what this site does with live Maine data"
        className="inline-flex max-w-full items-center gap-2.5 rounded-xl border border-white/10 bg-[#08131d]/55 px-3.5 py-2 text-left backdrop-blur-sm transition-colors hover:border-signal/40"
      >
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          Live
        </span>
        <MaineReadout showDot={false} className="text-white/75" />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`ml-0.5 h-3.5 w-3.5 shrink-0 text-white/45 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`grid transition-all duration-500 ease-out ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="mb-2 text-xs text-white/55">
            This whole site runs on live Portland, Maine data:
          </p>
          <ul className="space-y-1.5">
            {ITEMS.map((it) => (
              <li key={it.k} className="flex gap-2.5 text-xs leading-relaxed text-white/70">
                <span className="w-12 shrink-0 font-mono uppercase tracking-widest text-signal">{it.k}</span>
                <span>{it.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

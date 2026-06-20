"use client";

import { useState } from "react";
import Reveal from "./Reveal";

/*
  RentedVsBuilt — an interactive flip for "The Shift".
  Toggle between the rented way and the built way; the card lights up (accent
  glow) on "Build it" and each row crossfades. On-message + a little demo of the
  kind of interaction we build. Accent-aware via the signal token.
*/

const ROWS: { rent: string; own: string }[] = [
  { rent: "Per-seat fees, forever", own: "Pay once—it's yours" },
  { rent: "You bend to their forms", own: "Shaped to how you work" },
  { rent: "Locked in; can't leave", own: "No lock-in—you own it" },
  { rent: "Generic, like everyone", own: "Custom, only yours" },
  { rent: "Tools that don't talk", own: "Everything, linked" },
];

export default function RentedVsBuilt() {
  const [own, setOwn] = useState(true);
  return (
    <Reveal delay={120}>
      <div
        className={`mt-10 overflow-hidden rounded-2xl border p-6 transition-all duration-500 md:p-8 ${
          own
            ? "border-signal/40 bg-signal/[0.05] shadow-[0_0_70px_-18px_var(--color-signal-glow)]"
            : "border-line bg-surface"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
            // Rent it, or build it
          </p>
          <div
            className="inline-flex rounded-full border border-line bg-base p-1"
            role="tablist"
            aria-label="Rented versus built"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!own}
              onClick={() => setOwn(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !own ? "bg-white/10 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              Rent it
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={own}
              onClick={() => setOwn(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                own ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              Build it
            </button>
          </div>
        </div>

        <p className="mt-5 font-display text-xl text-ink md:text-2xl">
          {own
            ? "Software built for exactly how you work."
            : "Rented software you bend your business around."}
        </p>

        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {ROWS.map((r, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] transition-colors ${
                  own ? "bg-signal/15 text-signal" : "bg-white/5 text-faint"
                }`}
              >
                {own ? "✓" : "✕"}
              </span>
              <span className={`transition-colors ${own ? "text-ink" : "text-muted"}`}>
                {own ? r.own : r.rent}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">
          {own
            ? "That's what we build—and you own it outright."
            : "Flip the switch. That's the shift."}
        </p>
      </div>
    </Reveal>
  );
}

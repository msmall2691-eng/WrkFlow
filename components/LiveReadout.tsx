"use client";

import MaineReadout from "./MaineReadout";

/*
  LiveReadout — the hero's "live Maine data" panel. Kept intentionally
  simple: pulse marker, the readings, and a small "what it changes" line
  so the ambient system is legible in one glance. Theme + mode controls
  live in the floating AccentSwitcher (bottom-right) and the command
  palette; no reason to double them up here.
*/
const REACTS: { from: string; to: string }[] = [
  { from: "weather", to: "glow" },
  { from: "daylight", to: "theme" },
  { from: "sun", to: "sky" },
  { from: "tide", to: "waves" },
  { from: "buoy 44007", to: "swell" },
];

export default function LiveReadout() {
  return (
    <div className="rounded-2xl border border-[var(--panel-line)] bg-[var(--panel-bg)] p-4 backdrop-blur-sm">
      {/* Marker */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--panel-muted)]">
          This site runs on live Maine data
        </span>
      </div>

      {/* Live conditions */}
      <div className="mt-2.5">
        <MaineReadout showDot={false} className="text-[11px] text-[color:var(--panel-ink)]" />
      </div>

      {/* What it changes on the page */}
      <div className="mt-3 border-t border-[var(--panel-line)] pt-3">
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">
          What it changes
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-[color:var(--panel-muted)]">
          {REACTS.map((r) => (
            <span key={r.from}>
              <span className="text-signal">{r.from}</span> → {r.to}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

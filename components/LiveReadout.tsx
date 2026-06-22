"use client";

import MaineReadout from "./MaineReadout";

/*
  LiveReadout — a small, always-visible "live Maine" panel: the readout, a
  condensed map of what the data drives, and an inline theme remote you can try.
  Organized and quietly prominent — no dropdown.
*/
const REACTS: { from: string; to: string }[] = [
  { from: "weather", to: "glow" },
  { from: "daylight", to: "theme" },
  { from: "sun", to: "sky" },
  { from: "tide", to: "waves" },
];

const SWATCHES: { label: string; color: string; detail: number | "auto" }[] = [
  { label: "Harbor", color: "#2f6df0", detail: 1 },
  { label: "Rose", color: "#f43f5e", detail: 5 },
  { label: "Sea Glass", color: "#16a394", detail: 0 },
  { label: "Brass", color: "#d9a441", detail: 2 },
];

const setAccent = (detail: number | "auto") =>
  window.dispatchEvent(new CustomEvent("accent:set", { detail }));

export default function LiveReadout() {
  return (
    <div className="max-w-md rounded-xl border border-white/10 bg-[#08131d]/55 p-3.5 backdrop-blur-sm">
      {/* The live readout */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          Live
        </span>
        <MaineReadout showDot={false} className="text-white/75" />
      </div>

      {/* What the data drives — condensed */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-white/45">
        <span className="uppercase tracking-widest text-white/35">Reacts live</span>
        {REACTS.map((r) => (
          <span key={r.from}>
            <span className="text-signal">{r.from}</span> → {r.to}
          </span>
        ))}
      </div>

      {/* Inline theme remote — recolors the whole site */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-2.5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Theme</span>
        {SWATCHES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setAccent(s.detail)}
            title={s.label}
            aria-label={`Set accent: ${s.label}`}
            className="h-4 w-4 rounded-full ring-1 ring-white/25 transition-transform hover:scale-125"
            style={{ backgroundColor: s.color }}
          />
        ))}
        <button
          type="button"
          onClick={() => setAccent("auto")}
          title="Maine daylight (auto)"
          aria-label="Set accent: Maine daylight (auto)"
          className="h-4 w-4 rounded-full ring-1 ring-white/25 transition-transform hover:scale-125"
          style={{ backgroundImage: "linear-gradient(135deg,#e0a85a,#16a394 55%,#6f7fd6)" }}
        />
        <span className="font-mono text-[9px] text-white/30">try it →</span>
      </div>
    </div>
  );
}

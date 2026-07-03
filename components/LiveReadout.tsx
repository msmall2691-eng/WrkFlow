"use client";

import { useEffect, useState } from "react";
import MaineReadout from "./MaineReadout";

/*
  LiveReadout — the hero's "live Maine data" panel. Clear, labeled sections:
  what it is, the live conditions, what they change on the page, and a theme
  remote you can try. Quietly prominent, not a dropdown.
*/
const REACTS: { from: string; to: string }[] = [
  { from: "weather", to: "glow" },
  { from: "daylight", to: "theme" },
  { from: "sun", to: "sky" },
  { from: "tide", to: "waves" },
  { from: "buoy 44007", to: "swell" },
];

const SWATCHES: { label: string; color: string; detail: number | "auto" }[] = [
  { label: "Harbor", color: "#2f6df0", detail: 1 },
  { label: "Rose", color: "#f43f5e", detail: 5 },
  { label: "Sea Glass", color: "#16a394", detail: 0 },
  { label: "Brass", color: "#d9a441", detail: 2 },
];

const setAccent = (detail: number | "auto") =>
  window.dispatchEvent(new CustomEvent("accent:set", { detail }));

/* Persistent Harbor / Daylight toggle. Dark is the default; the flash-
   prevention script in layout.tsx reads localStorage before first paint. */
function useTheme(): [boolean, () => void] {
  const [light, setLight] = useState(false);
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
    const onChange = () => setLight(document.documentElement.dataset.theme === "light");
    window.addEventListener("theme:change", onChange);
    return () => window.removeEventListener("theme:change", onChange);
  }, []);
  const toggle = () => {
    const next = !light;
    if (next) {
      document.documentElement.dataset.theme = "light";
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    } else {
      delete document.documentElement.dataset.theme;
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    }
    setLight(next);
    window.dispatchEvent(new Event("theme:change"));
  };
  return [light, toggle];
}

export default function LiveReadout() {
  const [light, toggleTheme] = useTheme();
  return (
    <div className="rounded-2xl border border-[var(--panel-line)] bg-[var(--panel-bg)] p-4 backdrop-blur-sm">
      {/* What it is */}
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
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">What it changes</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-[color:var(--panel-muted)]">
          {REACTS.map((r) => (
            <span key={r.from}>
              <span className="text-signal">{r.from}</span> → {r.to}
            </span>
          ))}
        </div>
      </div>

      {/* Theme remote — recolors the whole site, live */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--panel-line)] pt-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">Theme</span>
        {SWATCHES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setAccent(s.detail)}
            title={s.label}
            aria-label={`Set accent: ${s.label}`}
            className="h-4 w-4 rounded-full ring-1 ring-[var(--panel-line)] transition-transform hover:scale-125 active:scale-95"
            style={{ backgroundColor: s.color }}
          />
        ))}
        <button
          type="button"
          onClick={() => setAccent("auto")}
          title="Maine daylight (auto)"
          aria-label="Set accent: Maine daylight (auto)"
          className="h-4 w-4 rounded-full ring-1 ring-[var(--panel-line)] transition-transform hover:scale-125 active:scale-95"
          style={{ backgroundImage: "linear-gradient(135deg,#e0a85a,#16a394 55%,#6f7fd6)" }}
        />
        <span className="font-mono text-[9px] text-[color:var(--panel-faint)]">try it →</span>
      </div>

      {/* Mode: Harbor (dark) vs Daylight (light) — persists in localStorage */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--panel-line)] pt-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">Mode</span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={light}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--panel-line)] px-2.5 py-1 font-mono text-[10px] text-[color:var(--panel-muted)] transition-colors hover:text-[color:var(--panel-ink)] active:scale-[0.96]"
        >
          <span aria-hidden="true">{light ? "☀" : "☾"}</span>
          {light ? "Daylight" : "Harbor"}
          <span className="text-[color:var(--panel-faint)]">· tap to swap</span>
        </button>
      </div>
    </div>
  );
}

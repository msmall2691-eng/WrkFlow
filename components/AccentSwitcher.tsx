"use client";

import { useEffect, useRef, useState } from "react";
import { getSunTimes } from "@/lib/sun";

/*
  AccentSwitcher — a public "make it yours" accent picker, now tied to place.

  By default the accent follows the actual Maine daylight: dawn sand → midday
  teal → dusk navy → night. Pick a swatch to override (saved per device);
  "Maine daylight" puts it back on auto. Updates the --color-signal variables
  that drive buttons, links, markers, toggles, sliders, etc.
*/

type Accent = { name: string; signal: string; dim: string };

const ACCENTS: Accent[] = [
  { name: "Sea Glass", signal: "#16a394", dim: "#0e8f86" },
  { name: "Harbor", signal: "#2f6df0", dim: "#1f54c9" },
  { name: "Brass", signal: "#d9a441", dim: "#b9842b" },
  { name: "Coral", signal: "#f4623a", dim: "#d94f2b" },
  { name: "Orchid", signal: "#8b5cf6", dim: "#7c3aed" },
  { name: "Rose", signal: "#f43f5e", dim: "#e11d48" },
];

// Maine daylight phases — the accent's place-based arc through the day.
const PHASES: Record<string, Accent> = {
  dawn: { name: "dawn", signal: "#e0a85a", dim: "#c98f43" }, // sand
  day: { name: "midday", signal: "#16a394", dim: "#0e8f86" }, // sea-glass teal
  dusk: { name: "dusk", signal: "#6f7fd6", dim: "#5566bd" }, // twilight blue
  night: { name: "night", signal: "#6b78c4", dim: "#5563aa" }, // deep navy (kept legible on dark)
};

const KEY = "mstudio-accent";
const TICK = 10 * 60 * 1000; // re-check the daylight phase every 10 min

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function currentPhase(now = new Date()): Accent {
  const { sunrise, sunset } = getSunTimes(now);
  const t = now.getTime();
  const hr = 3600000;
  if (t < sunrise.getTime() - 0.5 * hr || t > sunset.getTime() + hr) return PHASES.night;
  if (t < sunrise.getTime() + 1.5 * hr) return PHASES.dawn;
  if (t > sunset.getTime() - 1.5 * hr) return PHASES.dusk;
  return PHASES.day;
}

export default function AccentSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // index of manual accent, or -1 when auto
  const [auto, setAuto] = useState(true);
  const [phase, setPhase] = useState<Accent>(PHASES.day);
  const activeRef = useRef(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyColor = (a: Accent) => {
    const root = document.documentElement.style;
    root.setProperty("--color-signal", a.signal);
    root.setProperty("--color-signal-dim", a.dim);
    const { r, g, b } = hexToRgb(a.signal);
    root.setProperty("--color-signal-glow", `rgba(${r}, ${g}, ${b}, 0.16)`);
    window.dispatchEvent(new Event("accentchange"));
  };

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const enableAuto = (persist = true) => {
    setAuto(true);
    setActive(-1);
    activeRef.current = -1;
    const p = currentPhase();
    setPhase(p);
    applyColor(p);
    if (persist) {
      try {
        localStorage.setItem(KEY, "auto");
      } catch {
        /* ignore */
      }
    }
    stopTimer();
    timer.current = setInterval(() => {
      const np = currentPhase();
      setPhase(np);
      applyColor(np);
    }, TICK);
  };

  const selectManual = (i: number, persist = true) => {
    setAuto(false);
    setActive(i);
    activeRef.current = i;
    stopTimer();
    applyColor(ACCENTS[i]);
    if (persist) {
      try {
        localStorage.setItem(KEY, String(i));
      } catch {
        /* ignore */
      }
    }
  };

  // Restore saved preference (default: Maine daylight auto).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (saved != null && saved !== "auto" && ACCENTS[Number(saved)]) selectManual(Number(saved), false);
    else enableAuto(false);
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Command palette "Toggle accent color" — cycle the manual swatches.
  useEffect(() => {
    const onCycle = () => selectManual((activeRef.current + 1 + ACCENTS.length) % ACCENTS.length);
    window.addEventListener("accent:cycle", onCycle);
    return () => window.removeEventListener("accent:cycle", onCycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swatch = auto ? phase : ACCENTS[active] ?? PHASES.day;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-60 rounded-2xl border border-line bg-surface/95 p-4 shadow-2xl backdrop-blur-md">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-faint">
            Make it yours · accent
          </p>

          {/* Auto — follows Maine daylight */}
          <button
            type="button"
            onClick={() => enableAuto()}
            className={`mb-3 flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
              auto ? "border-signal/50 bg-signal/10" : "border-line hover:bg-white/5"
            }`}
          >
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: phase.signal }} />
            <span className="flex-1 text-xs text-ink">Maine daylight</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{phase.name}</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            {ACCENTS.map((a, i) => (
              <button
                key={a.name}
                type="button"
                onClick={() => selectManual(i)}
                title={a.name}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-white/5 ${
                  !auto && active === i ? "bg-white/5" : ""
                }`}
              >
                <span
                  className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-surface transition ${
                    !auto && active === i ? "ring-ink" : "ring-transparent"
                  }`}
                  style={{ backgroundColor: a.signal }}
                />
                <span className="text-[10px] text-muted">{a.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-faint">
              {auto ? "Following Maine daylight" : "Saved on this device"}
            </span>
            {!auto && (
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem(KEY);
                  } catch {
                    /* ignore */
                  }
                  enableAuto(false);
                }}
                className="font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change accent color"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted shadow-lg backdrop-blur-md transition-colors hover:text-ink"
      >
        <span
          className="h-3.5 w-3.5 rounded-full ring-2 ring-offset-1 ring-offset-surface"
          style={{ backgroundColor: swatch.signal }}
        />
        {auto ? "Maine" : "Accent"}
      </button>
    </div>
  );
}

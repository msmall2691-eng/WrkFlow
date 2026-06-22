"use client";

import { useEffect, useRef, useState } from "react";

/*
  AccentSwitcher — a public "make it yours" accent picker.

  Lets any visitor recolor the site's accent live (updates the --color-signal
  CSS variables that drive buttons, links, markers, toggles, sliders, etc.).
  The choice is saved to localStorage so it sticks on return visits.
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
const KEY = "mstudio-accent";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export default function AccentSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const apply = (i: number, persist = true) => {
    const a = ACCENTS[i];
    const root = document.documentElement.style;
    root.setProperty("--color-signal", a.signal);
    root.setProperty("--color-signal-dim", a.dim);
    const { r, g, b } = hexToRgb(a.signal);
    root.setProperty("--color-signal-glow", `rgba(${r}, ${g}, ${b}, 0.16)`);
    setActive(i);
    activeRef.current = i;
    if (persist) {
      try {
        localStorage.setItem(KEY, String(i));
      } catch {
        /* ignore */
      }
    }
    window.dispatchEvent(new Event("accentchange"));
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw != null) {
        const i = Number(raw);
        if (ACCENTS[i]) apply(i, false);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Let the command palette cycle the accent (Actions → "Toggle accent color").
  useEffect(() => {
    const onCycle = () => apply((activeRef.current + 1) % ACCENTS.length);
    window.addEventListener("accent:cycle", onCycle);
    return () => window.removeEventListener("accent:cycle", onCycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-56 rounded-2xl border border-line bg-surface/95 p-4 shadow-2xl backdrop-blur-md">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-faint">
            Make it yours · accent
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ACCENTS.map((a, i) => (
              <button
                key={a.name}
                type="button"
                onClick={() => apply(i)}
                title={a.name}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-white/5 ${
                  active === i ? "bg-white/5" : ""
                }`}
              >
                <span
                  className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-surface transition ${
                    active === i ? "ring-ink" : "ring-transparent"
                  }`}
                  style={{ backgroundColor: a.signal }}
                />
                <span className="text-[10px] text-muted">{a.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-faint">Saved on this device</span>
            <button
              type="button"
              onClick={() => {
                apply(0, false);
                try {
                  localStorage.removeItem(KEY);
                } catch {
                  /* ignore */
                }
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
            >
              Reset
            </button>
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
          style={{ backgroundColor: ACCENTS[active].signal, color: ACCENTS[active].signal }}
        />
        Accent
      </button>
    </div>
  );
}

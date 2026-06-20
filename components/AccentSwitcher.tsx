"use client";

import { useEffect, useState } from "react";

/*
  Preview-only accent comparison tool. Lets us evaluate accent colors on the
  real site, in context. Hidden on the production domain (hostname-gated), so
  it only appears on Vercel previews and local dev. Setting an accent updates
  the CSS variables and fires "accentchange" so the canvas grid re-reads it.
*/

type Accent = { name: string; signal: string; dim: string };

const ACCENTS: Accent[] = [
  { name: "Ion Blue", signal: "#3b8cff", dim: "#2f74d9" },
  { name: "Signal Cyan", signal: "#2de2c4", dim: "#1aa890" },
  { name: "Electric Lime", signal: "#9ef01a", dim: "#7bc70f" },
  { name: "Warm Amber", signal: "#ffb020", dim: "#d98b0a" },
];

const PRODUCTION_HOSTS = ["tideandtrue.co", "www.tideandtrue.co", "wrk-flow.vercel.app"];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export default function AccentSwitcher() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setShow(!PRODUCTION_HOSTS.includes(window.location.hostname));
  }, []);

  if (!show) return null;

  const apply = (i: number) => {
    const a = ACCENTS[i];
    const root = document.documentElement.style;
    root.setProperty("--color-signal", a.signal);
    root.setProperty("--color-signal-dim", a.dim);
    const { r, g, b } = hexToRgb(a.signal);
    root.setProperty("--color-signal-glow", `rgba(${r}, ${g}, ${b}, 0.14)`);
    setActive(i);
    window.dispatchEvent(new Event("accentchange"));
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] rounded-xl border border-line bg-surface/90 p-3 backdrop-blur-md">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
        Preview · accent
      </p>
      <div className="flex items-center gap-2">
        {ACCENTS.map((a, i) => (
          <button
            key={a.name}
            type="button"
            onClick={() => apply(i)}
            title={a.name}
            aria-label={`Set accent to ${a.name}`}
            className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${
              active === i ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
            }`}
            style={{ backgroundColor: a.signal }}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted">{ACCENTS[active].name}</p>
    </div>
  );
}

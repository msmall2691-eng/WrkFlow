"use client";

import { useEffect, useState } from "react";

/*
  KonamiEgg — ↑↑↓↓←→←→ b a flips on a "lighthouse beam": a warm sweep across the
  screen plus a few seconds of gold accent, then everything reverts. Pure delight.
*/
const SEQ = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

export default function KonamiEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let i = 0;
    const fire = () => {
      setActive(true);
      const root = document.documentElement;
      const prev = root.style.getPropertyValue("--color-signal");
      root.style.setProperty("--color-signal", "#f5d06b");
      window.dispatchEvent(new Event("accentchange"));
      window.setTimeout(() => {
        if (prev) root.style.setProperty("--color-signal", prev);
        else root.style.removeProperty("--color-signal");
        window.dispatchEvent(new Event("accentchange"));
        setActive(false);
      }, 4500);
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === SEQ[i]) {
        i++;
        if (i === SEQ.length) {
          i = 0;
          fire();
        }
      } else {
        i = k === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <div
        className="beam absolute left-1/2 top-1/2 h-[220vmax] w-[26vmax]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(245,208,107,0.30) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

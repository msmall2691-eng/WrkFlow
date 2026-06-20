"use client";

import { useEffect, useState } from "react";

/*
  HeroCapabilities — the "what we build" line. Websites lead; the rest gently
  cycle a highlight so there's life on mobile (where hover doesn't exist).
  Hover still brightens individually on desktop.
*/
const CAPS = ["Automation", "Workflows", "Dashboards", "Custom tools"];

export default function HeroCapabilities() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % CAPS.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm">
      <span className="font-medium text-white">Websites &amp; web apps</span>
      {CAPS.map((t, i) => (
        <span
          key={t}
          className={`transition-colors duration-500 before:mr-1 before:text-white/20 before:content-['·'] hover:text-white ${
            i === active ? "text-white" : "text-white/45"
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

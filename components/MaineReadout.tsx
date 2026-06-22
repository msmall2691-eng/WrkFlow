"use client";

import { useEffect, useState } from "react";

/*
  MaineReadout — a live line for Portland, ME: air + water temp, wind, tide,
  next sun / golden hour, and the moon at night. From /api/maine. Renders only
  the fields that come back; nothing until real data arrives.
*/
type Data = {
  place: string;
  tempF: number | null;
  waterTempF: number | null;
  wind: { mph: number; dir: string } | null;
  tide: "rising" | "falling" | null;
  sun: { label: string; time: string } | null;
  light: { label: string; time?: string } | null;
  moon: { phase: string; emoji: string } | null;
  night: boolean;
};

export default function MaineReadout({ className = "" }: { className?: string }) {
  const [d, setD] = useState<Data | null>(null);

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => on && setD(j))
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  if (!d) return null;

  const parts: string[] = [d.place];
  if (d.tempF != null) parts.push(`${d.tempF}°`);
  if (d.waterTempF != null) parts.push(`${d.waterTempF}° water`);
  if (d.wind && d.wind.mph > 0) parts.push(`wind ${d.wind.mph}${d.wind.dir ? ` ${d.wind.dir}` : ""}`);
  if (d.tide) parts.push(`tide ${d.tide}`);
  if (d.light) parts.push(d.light.time ? `${d.light.label} ${d.light.time}` : d.light.label);
  else if (d.sun) parts.push(`${d.sun.label} ${d.sun.time}`);
  if (d.night && d.moon) parts.push(`${d.moon.emoji} ${d.moon.phase.toLowerCase()}`);

  if (parts.length === 1) return null;

  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] ${className}`}>
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
      </span>
      <span>{parts.join(" · ")}</span>
    </p>
  );
}

"use client";

import { useMaine } from "@/lib/useMaine";

/*
  MaineReadout — a live line for Portland, ME: air + water temp, wind, tide,
  next sun / golden hour, and the moon at night. Reads the shared /api/maine
  cache. Renders only the fields that come back; nothing until real data
  arrives.
*/
export default function MaineReadout({
  className = "",
  showDot = true,
}: {
  className?: string;
  showDot?: boolean;
}) {
  const d = useMaine();
  if (!d) return null;

  const parts: string[] = [d.place];
  if (d.tempF != null) parts.push(`${d.tempF}°`);
  if (d.waterTempF != null) parts.push(`${d.waterTempF}° water`);
  if (d.wind && d.wind.mph > 0) parts.push(`wind ${d.wind.mph}${d.wind.dir ? ` ${d.wind.dir}` : ""}`);
  if (d.tide) parts.push(`tide ${d.tide}`);
  if (d.wave && d.wave.m > 0) parts.push(`swell ${d.wave.m.toFixed(1)}m`);
  if (d.light) parts.push(d.light.time ? `${d.light.label} ${d.light.time}` : d.light.label);
  else if (d.sun) parts.push(`${d.sun.label} ${d.sun.time}`);
  if (d.night && d.moon) parts.push(`${d.moon.emoji} ${d.moon.phase.toLowerCase()}`);

  if (parts.length === 1) return null;

  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] ${className}`}>
      {showDot && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
      )}
      <span>{parts.join(" · ")}</span>
    </p>
  );
}

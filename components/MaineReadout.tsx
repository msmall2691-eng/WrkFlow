"use client";

import { useEffect, useState } from "react";

/*
  MaineReadout — a tiny live line for Portland, ME (temp · tide · next sun),
  pulled from /api/maine. Renders nothing until real data arrives, and only
  shows the fields that came back. A quiet "live systems, rooted in a place".
*/
type Data = {
  place: string;
  tempF: number | null;
  tide: "rising" | "falling" | null;
  sun: { label: string; time: string } | null;
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

  const parts = [d.place];
  if (d.tempF != null) parts.push(`${d.tempF}°`);
  if (d.tide) parts.push(`tide ${d.tide}`);
  if (d.sun) parts.push(`${d.sun.label} ${d.sun.time}`);
  if (parts.length === 1) return null; // nothing live came back

  return (
    <p className={`inline-flex items-center gap-2 font-mono text-[11px] ${className}`}>
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
      </span>
      <span>{parts.join(" · ")}</span>
    </p>
  );
}

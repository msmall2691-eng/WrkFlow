"use client";

import { useMaine } from "@/lib/useMaine";

/*
  TideKey — a small, quiet legend for the founder section's "water": tells you
  it's the live Portland tide and where it's headed. Explanatory, not a focal
  point.

  It used to fetch /api/maine itself, on the assumption the browser would
  dedupe it against the shared call. It did not: a page load made two
  identical requests. It reads the useMaine cache now, which is the thing
  built to guarantee one fetch rather than hope for one.
*/
export default function TideKey() {
  const d = useMaine();

  if (!d?.tide) return null;
  const pct = typeof d.tideLevel === "number" ? Math.round(d.tideLevel * 100) : null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#08131d]/75 px-3 py-1.5 font-mono text-[10px] text-white/80 shadow-lg backdrop-blur">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
      </span>
      <span>
        Live tide{pct != null ? ` ${pct}%` : ""} · {d.tide}
        {d.nextTide ? ` · ${d.nextTide.type} ${d.nextTide.time}` : ""}
      </span>
    </span>
  );
}

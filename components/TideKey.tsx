"use client";

import { useEffect, useState } from "react";

/*
  TideKey — a small, quiet legend for the founder section's "water": tells you
  it's the live Portland tide and where it's headed. Explanatory, not a focal
  point. Pulls from /api/maine (browser-cached, so it shares the same call).
*/
type Data = {
  tide?: "rising" | "falling" | null;
  nextTide?: { type: string; time: string } | null;
  tideLevel?: number | null;
};

export default function TideKey() {
  const [d, setD] = useState<Data>({});

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

  if (!d.tide) return null;
  const pct = typeof d.tideLevel === "number" ? Math.round(d.tideLevel * 100) : null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#08131d]/50 px-3 py-1.5 font-mono text-[10px] text-white/55 backdrop-blur">
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

"use client";

import { useMaine } from "@/lib/useMaine";
import { adviceFor } from "@/lib/conditions";

/*
  LiveTile — Portland right now, read the way a business would read it.

  Temperature and sky from the NWS observation at the Jetport, the next tide
  and current tide height from NOAA's Portland station, sunset computed. The
  tide bar is the real tide level (0 = low, 1 = high) as a scaleY, so it is
  data, not decoration, and it does not loop.

  Until /api/maine answers, the tile says it is reading. It never shows a
  number it does not have.
*/
export default function LiveTile() {
  const d = useMaine();
  const advice = adviceFor(d);
  const level = d?.tideLevel ?? null;

  return (
    <section aria-label="Live conditions in Portland, Maine" className="cp-tile flex min-w-0 flex-col gap-2.5 p-[18px]">
      <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-[color:var(--cp-soft)]">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--cp-teal)]" />
        PORTLAND, ME · LIVE
      </span>

      {d ? (
        <>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-[44px] font-semibold leading-none tracking-[-0.04em] text-[color:var(--cp-ink)]">
              {d.tempF != null ? `${d.tempF}°` : "—"}
            </span>
            {d.conditions ? (
              <span className="text-[14px] text-[color:var(--cp-soft)]">{d.conditions.text}</span>
            ) : null}
          </div>
          {advice ? <p className="m-0 text-[13px] leading-snug text-[color:var(--cp-muted)]">{advice}</p> : null}

          <div className="mt-auto flex items-end gap-3 pt-1">
            {level != null ? (
              <span
                className="relative h-11 w-2.5 shrink-0 overflow-hidden rounded-full bg-white/[0.06]"
                role="img"
                aria-label={`Tide at ${Math.round(level * 100)}% between low and high`}
              >
                <span
                  className="absolute inset-0 origin-bottom rounded-full bg-gradient-to-t from-[color:var(--cp-teal)] to-[color:var(--cp-violet)]"
                  style={{ transform: `scaleY(${Math.max(0.06, level)})` }}
                />
              </span>
            ) : null}
            <span className="flex flex-col gap-0.5 font-mono text-[11px] leading-snug text-[color:var(--cp-soft)]">
              {d.nextTide ? (
                <span>
                  {d.tide === "rising" ? "▲" : "▼"} {d.nextTide.type.toUpperCase()} TIDE {d.nextTide.time}
                </span>
              ) : null}
              {d.sun ? (
                <span className="text-[color:var(--cp-faint)]">
                  {d.sun.label.toUpperCase()} {d.sun.time}
                </span>
              ) : null}
            </span>
          </div>
        </>
      ) : (
        <p className="m-0 text-[13px] text-[color:var(--cp-muted)]">Reading the Portland sky…</p>
      )}
    </section>
  );
}

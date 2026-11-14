"use client";

import Link from "next/link";

import { useMaine } from "@/lib/useMaine";
import { adviceFor } from "@/lib/conditions";

/*
  LiveTile — five public feeds merged into one readout.

  **It is labelled as integration work now, and that is the point of the
  change.** The tile has always pulled five independent sources — the NWS
  observation at the Jetport, NOAA's Portland tide predictions, NOAA water
  temperature, NDBC buoy 44007 and active NWS alerts — merged them, cached
  them, and dropped any one of them quietly when it fails. That is precisely
  the thing a small business is trying to buy when it says its tools do not
  talk to each other.

  Presented as "45°, cloudy" it read as a personal touch: a visitor deciding
  whether to hire somebody saw weather in the most valuable space on the
  page. Nothing about the code changed; the frame around it now names what
  it is evidence of, and the sources are listed so the claim is checkable
  rather than asserted.

  The tide bar is the real tide level (0 = low, 1 = high) as a scaleY, so it
  is data rather than decoration, and it does not loop. Until /api/maine
  answers, the tile says it is reading: it never shows a number it does not
  have, which is the same honesty the rest of the site is held to.
*/
export default function LiveTile() {
  const d = useMaine();
  const advice = adviceFor(d);
  const level = d?.tideLevel ?? null;

  return (
    <section aria-label="Five live data feeds merged into one readout" className="cp-tile flex min-w-0 flex-col gap-2.5 p-[18px]">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-[color:var(--cp-soft)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--cp-teal)]" />
          5 LIVE FEEDS · ONE READOUT
        </span>
        <Link href="/services" className="shrink-0 text-[13px] text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80">
          Connect yours →
        </Link>
      </div>

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
                className="relative h-11 w-2.5 shrink-0 overflow-hidden rounded-full bg-[color:var(--cp-fill-strong)]"
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

      {/* Outside the ternary: this describes what the tile *is*, so it should
          not blink in once the data lands. Naming the five sources is what
          makes it checkable rather than a claim — anybody can go and look at
          them. */}
      <p className="m-0 border-t border-[color:var(--cp-line)] pt-2.5 text-[12px] leading-snug text-[color:var(--cp-faint)]">
        Weather, tide, water temperature, buoy and alerts, from five public
        feeds. One goes down, this stays up. Same job as putting your bookings,
        invoices and crew on one screen.
      </p>
    </section>
  );
}

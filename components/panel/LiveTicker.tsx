"use client";

import { useMaine } from "@/lib/useMaine";

/*
  LiveTicker — the bottom edge of the homepage panel.

  Every item is a live reading from /api/maine (NWS, NOAA tides, NOAA buoy
  44007, computed sun and moon). An item with no reading is left out, and the
  whole strip renders nothing until the endpoint answers. Nothing here is a
  sample.

  TODO(Meg): a feed from your own systems (turnovers synced today, quotes
  drafted, last job completed) would be the strongest line on this strip.
  It needs a small read-only endpoint that returns counts only, never
  customer details. When it exists, add its items to `items` below.

  Motion: the strip scrolls with a translateX loop. It pauses on hover and
  focus, pauses off-screen through PanelStage's data-off, and under reduced
  motion it does not move at all (it becomes a horizontally scrollable row).
*/
export default function LiveTicker() {
  const d = useMaine();
  if (!d) return null;

  const items: { k: string; v: string }[] = [];
  if (d.tempF != null) items.push({ k: "PORTLAND AIR", v: `${d.tempF}°F${d.conditions ? ` · ${d.conditions.text}` : ""}` });
  if (d.waterTempF != null) items.push({ k: "CASCO BAY WATER", v: `${d.waterTempF}°F` });
  if (d.wind) items.push({ k: "WIND", v: `${d.wind.mph} mph${d.wind.dir ? ` ${d.wind.dir}` : ""}` });
  if (d.nextTide) items.push({ k: `NEXT ${d.nextTide.type.toUpperCase()} TIDE`, v: d.nextTide.time });
  if (d.wave) items.push({ k: "OFFSHORE SWELL", v: `${d.wave.m} m · buoy 44007` });
  items.push({ k: "SUNRISE", v: d.sunrise });
  items.push({ k: "SUNSET", v: d.sunset });
  if (d.moon) items.push({ k: "MOON", v: d.moon.phase });
  if (d.alert) items.push({ k: "NWS ALERT", v: d.alert.event });

  const row = (hidden: boolean) =>
    items.map((it) => (
      <span
        key={`${hidden ? "b" : "a"}-${it.k}`}
        aria-hidden={hidden || undefined}
        className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-mono text-[12px]"
      >
        <span className="text-[color:var(--cp-violet-ink)]">{it.k}</span>
        <span className="text-[color:var(--cp-ink)]">{it.v}</span>
      </span>
    ));

  return (
    <section
      aria-label="Live readings from the Maine coast"
      className="relative flex items-center overflow-hidden border-t border-[color:var(--cp-line)] bg-[#08070c]/70"
    >
      <span className="relative z-[1] flex shrink-0 items-center gap-2 border-r border-[color:var(--cp-line)] bg-[#08070c] py-3 pl-6 pr-4 font-mono text-[11px] tracking-[0.1em] text-[color:var(--cp-teal)] lg:pl-7">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--cp-teal)]" />
        LIVE · NWS + NOAA
      </span>
      <div className="cp-ticker-mask min-w-0 flex-1 overflow-hidden" tabIndex={0} aria-label="Live readings, scrolling">
        <div className="cp-marquee flex w-max gap-14 py-3 pl-6">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useMaine } from "@/lib/useMaine";
import DayScrubber from "./DayScrubber";
import { maineTime } from "@/lib/daylight";

/*
  LiveReadout — the hero's live-conditions panel.

  Previously a single run-on line of readings, which showed the data but
  never made the point: that the page you're looking at is *driven* by it.
  Now a labelled grid, so each reading is legible on its own, plus an
  explicit map from each input to the thing on the page it changes.

  Tiles render only when their reading is present — the upstream feeds drop
  fields routinely (no buoy swell in winter, no moon during the day), and a
  tile reading "—" is worse than no tile. Before any data arrives the panel
  holds its shape with placeholders rather than popping in late.
*/

type Tile = { label: string; value: string; drives: string };

/*
  Why the page is the colour it is (brief A2.4). When the theme is on Auto the
  claim above this line is doing real work, so it should show its reasoning —
  and when someone has overridden it, saying "the daylight sets the theme"
  without qualification would be false for them.
*/
function useThemeReason(sunset: string | undefined, scrubbedTo: number | null) {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const root = document.documentElement;
      const isLight = root.dataset.theme === "light";
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        /* ignore */
      }
      // A scrub outranks both explanations below: whatever the page is showing
      // right now, the reason is that the visitor dragged it there.
      if (scrubbedTo != null) {
        setLine(`Previewing ${maineTime(scrubbedTo)} in Portland.`);
        return;
      }
      if (stored === "light" || stored === "dark") {
        setLine(`${isLight ? "Daylight" : "Harbor"} because you chose it.`);
        return;
      }
      setLine(
        isLight
          ? `Light because the sun is up in Portland${sunset ? ` — sunset ${sunset}` : ""}.`
          : "Dark because the sun is down in Portland.",
      );
    };
    read();
    window.addEventListener("theme:change", read);
    return () => window.removeEventListener("theme:change", read);
  }, [sunset, scrubbedTo]);

  return line;
}

export default function LiveReadout() {
  const d = useMaine();
  /*
    Mirrors DayScrubber's preview so the panel never reads "Now" over a page
    that is showing 7pm. The scrubber owns the value; this only listens.
  */
  const [scrubbedTo, setScrubbedTo] = useState<number | null>(null);
  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent).detail as { at: number } | null;
      setScrubbedTo(detail ? detail.at : null);
    };
    window.addEventListener("daylight:scrub", on);
    return () => window.removeEventListener("daylight:scrub", on);
  }, []);
  const reason = useThemeReason(d?.sunset, scrubbedTo);

  const tiles: Tile[] = [];
  if (d) {
    if (d.tempF != null) tiles.push({ label: "Air", value: `${d.tempF}°F`, drives: "glow" });
    if (d.waterTempF != null)
      tiles.push({ label: "Water", value: `${d.waterTempF}°F`, drives: "depth" });
    if (d.wind && d.wind.mph > 0)
      tiles.push({
        label: "Wind",
        value: `${d.wind.mph}${d.wind.dir ? ` ${d.wind.dir}` : ""}`,
        drives: "drift",
      });
    if (d.conditions?.text)
      tiles.push({ label: d.fog ? "Fog" : "Sky", value: d.conditions.text, drives: "haze" });
    if (d.tide) tiles.push({ label: "Tide", value: d.tide, drives: "waves" });
    if (d.wave && d.wave.m > 0)
      tiles.push({ label: "Swell", value: `${d.wave.m.toFixed(1)}m`, drives: "swell" });
    if (d.light) tiles.push({ label: "Light", value: d.light.label, drives: "accent" });
    else if (d.sun) tiles.push({ label: d.sun.label, value: d.sun.time, drives: "accent" });
    if (d.night && d.moon)
      tiles.push({ label: "Moon", value: d.moon.phase.toLowerCase(), drives: "night" });
  }

  const shown = tiles.slice(0, 6);
  const loading = shown.length === 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--panel-line)] bg-[var(--panel-bg)] backdrop-blur-sm">
      {/* Header — says plainly where this comes from. */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--panel-line)] px-4 py-2.5">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--panel-ink)]">
            Live · {d?.place ?? "Portland, ME"}
          </span>
        </span>
        <span
          className={`font-mono text-[9px] uppercase tracking-widest ${
            scrubbedTo != null ? "text-signal" : "text-[color:var(--panel-faint)]"
          }`}
        >
          {scrubbedTo != null ? maineTime(scrubbedTo) : loading ? "Reading…" : "Now"}
        </span>
      </div>

      {/* Readings — one box per measurement. */}
      <div className="grid grid-cols-3 gap-px bg-[var(--panel-line)]">
        {(loading ? Array.from({ length: 6 }) : shown).map((t, i) => {
          const tile = t as Tile | undefined;
          return (
            <div key={tile?.label ?? i} className="bg-[var(--panel-bg)] px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">
                {tile?.label ?? "—"}
              </p>
              <p className="mt-1 truncate font-mono text-[13px] leading-none text-[color:var(--panel-ink)]">
                {tile?.value ?? "··"}
              </p>
              <p className="mt-1.5 font-mono text-[9px] leading-none text-signal">
                → {tile?.drives ?? ""}
              </p>
            </div>
          );
        })}
      </div>

      {/* The point of the whole panel. Every clause here is now literally
          true: middleware serves Daylight between sunrise and sunset, the
          accent follows the sun's phase through the day, and the aurora and
          water react to live weather and tide. */}
      <div className="border-t border-[var(--panel-line)] px-4 py-2.5">
        <p className="text-[11px] leading-relaxed text-[color:var(--panel-muted)]">
          This page reads the Maine coast in real time — the daylight sets the
          theme and the accent, the weather sets the glow, the tide moves the
          water.
        </p>
        {reason && (
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--panel-faint)]">
            {reason}
          </p>
        )}
      </div>

      {/* The handle that makes all of the above checkable. */}
      <DayScrubber />
    </div>
  );
}

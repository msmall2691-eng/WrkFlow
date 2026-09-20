"use client";

import { useEffect, useState } from "react";
import { useMaine } from "@/lib/useMaine";
import DayScrubber from "./DayScrubber";
import { maineTime } from "@/lib/daylight";

/*
  LiveReadout — the hero's live-conditions panel.

  Each tile is a reading plus an arrow naming the thing on the page it drives.
  That arrow is the whole reason the panel exists, and for a while it was the
  least true thing on the site: in Daylight the tiles read "air → glow",
  "wind → drift", "sky → haze", "tide → waves" while the aurora that
  consumed those numbers had unmounted itself, the tide widget lived on
  another page, and the hero behind them was a fixed gradient. Four arrows,
  nothing moving.

  So the arrows are computed now, per theme and per reading, and one is
  printed only where the effect is genuinely on screen:

    Daylight  sky → cloud, sun → sky, wind → drift, air → warmth
              (all four land on DaylightSky, which paints the hero)
    Harbor    sky → swell, air → glow, wind → drift, moon → night
              (all four land on ReactiveAurora and WeatherLayer)

  Wind only claims the drift when there is something up there to drift — a
  clear Harbor night has no precipitation layer to lean. The tide dropped out
  of the panel entirely: it drives TideLevel, which is on /about, not here.

  Tiles render only when their reading is present — the upstream feeds drop
  fields routinely (no buoy swell in winter, no moon during the day), and a
  tile reading "—" is worse than no tile. Before any data arrives the panel
  holds its shape with placeholders rather than popping in late.
*/

type Tile = { label: string; value: string; drives?: string };

/* Is the page in Daylight right now? Several things below branch on it. */
function useLightTheme() {
  const [light, setLight] = useState(true);
  useEffect(() => {
    const read = () => setLight(document.documentElement.dataset.theme === "light");
    read();
    window.addEventListener("theme:change", read);
    return () => window.removeEventListener("theme:change", read);
  }, []);
  return light;
}

/*
  Why the page looks the way it does.

  This used to explain the theme, back when the theme followed the sun. It
  then spent a release claiming "accent follows the Portland sun", which was
  false for anyone who had not opened the appearance panel and switched the
  accent to auto — the shipped default is the fixed Harbor blue, because a
  midday sky-blue button with white text on it fails contrast.

  What does follow the sun is the backdrop: DaylightSky in Daylight, the
  aurora swell in Harbor. So that is what the line says.
*/
function useBackdropReason(
  sunset: string | undefined,
  scrubbedTo: number | null,
  light: boolean,
) {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    // A scrub outranks the explanation: whatever the page is showing right
    // now, the reason is that the visitor dragged it there.
    if (scrubbedTo != null) {
      setLine(`Previewing ${maineTime(scrubbedTo)} in Portland.`);
      return;
    }
    if (light) {
      setLine(
        sunset
          ? `Sky above follows the Portland sun — sunset ${sunset}.`
          : "Sky above follows the Portland sun.",
      );
      return;
    }
    setLine("Harbor — the swell follows the Portland weather.");
  }, [sunset, scrubbedTo, light]);

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
  const light = useLightTheme();
  const reason = useBackdropReason(d?.sunset, scrubbedTo, light);

  const tiles: Tile[] = [];
  if (d) {
    /*
      Is there a cloud deck to speak of, and is WeatherLayer painting
      anything? On a genuinely clear day the deck's opacity rounds to
      nothing, so neither the sky reading nor the wind gets to claim it —
      a clear sky's contribution to this page is the absence of an effect.
    */
    const cloud = 1 - (d.conditions?.clarity ?? 0.6);
    const decked = cloud > 0.18;
    const wet = /(rain|drizzle|shower|snow|flurr|sleet|wintry)/i.test(d.conditions?.text ?? "");
    const blowing = light ? decked : wet || d.fog;

    const sky: Tile | null = d.conditions?.text
      ? {
          label: d.fog ? "Fog" : "Sky",
          value: d.conditions.text,
          drives: light
            ? decked
              ? "cloud"
              : undefined
            : wet || d.fog
              ? "haze"
              : "swell",
        }
      : null;
    const air: Tile | null =
      d.tempF != null
        ? {
            label: "Air",
            value: `${d.tempF}°F`,
            // In Daylight the temperature leans the sky warm or cool, and
            // that lean is scaled by the sun's altitude — so after dark it
            // genuinely does nothing.
            drives: light ? (d.night ? undefined : "warmth") : "glow",
          }
        : null;
    const wind: Tile | null =
      d.wind && d.wind.mph > 0
        ? {
            label: "Wind",
            value: `${d.wind.mph}${d.wind.dir ? ` ${d.wind.dir}` : ""}`,
            drives: blowing ? "drift" : undefined,
          }
        : null;
    const sun: Tile | null = d.light
      ? { label: "Light", value: d.light.label, drives: light ? "sky" : undefined }
      : d.sun
        ? { label: d.sun.label, value: d.sun.time, drives: light ? "sky" : undefined }
        : null;
    const moon: Tile | null =
      d.night && d.moon
        ? {
            label: "Moon",
            value: d.moon.phase.toLowerCase(),
            drives: light ? "moonlight" : "night",
          }
        : null;

    /*
      Only four tiles fit, so the ones that are actually driving the backdrop
      go first — otherwise a clear, still day fills the panel with readings
      that do nothing and pushes the sun, which is doing all the work, out of
      view. Stable within each half, so the order stays familiar day to day.
      The tide is deliberately absent: it drives TideLevel, on /about.
    */
    const order = (light ? [sky, sun, wind, air, moon] : [sky, air, wind, moon, sun]).filter(
      (t): t is Tile => t != null,
    );
    tiles.push(...order.filter((t) => t.drives), ...order.filter((t) => !t.drives));
  }

  const shown = tiles.slice(0, 4);
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
      <div className="grid grid-cols-2 gap-px bg-[var(--panel-line)]">
        {(loading ? Array.from({ length: 4 }) : shown).map((t, i) => {
          const tile = t as Tile | undefined;
          return (
            <div key={tile?.label ?? i} className="bg-[var(--panel-bg)] px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">
                {tile?.label ?? "—"}
              </p>
              <p className="mt-1 truncate font-mono text-[13px] leading-none text-[color:var(--panel-ink)]">
                {tile?.value ?? "··"}
              </p>
              {/* No arrow where nothing is driven — but the row still
                  occupies its line, or the tiles would sit at four
                  different heights. */}
              <p className="mt-1.5 font-mono text-[9px] leading-none text-signal">
                {tile?.drives ? `→ ${tile.drives}` : " "}
              </p>
            </div>
          );
        })}
      </div>

      {/* One line, and it has to stay true. It was trimmed once already,
          when the theme stopped following the sun; this version finally has
          the mechanism behind it, because DaylightSky paints the hero from
          the same readings the tiles above are showing. */}
      <div className="border-t border-[var(--panel-line)] px-4 py-2.5">
        <p className="text-[11px] leading-relaxed text-[color:var(--panel-muted)]">
          Live from the Maine coast — the weather and the sun are colouring
          this page as you read it.
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

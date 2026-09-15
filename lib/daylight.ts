/*
  daylight.ts — the single source of truth for "what colour is the Maine day
  at time T".

  The accent phases used to live inside AccentSwitcher, which was fine while
  the switcher was the only thing that needed them. DayScrubber needs the same
  arc to answer a different question ("what would the page look like at 4pm?"),
  and two copies of a colour table drift. Both read from here now.

  Everything in this file is pure local math on a Date — no network, no
  Node APIs — so it is equally safe in a Client Component, a Server
  Component, and the Edge middleware.
*/

import { getSunTimes } from "./sun";

export type Phase = {
  /** Lowercase label shown in the UI ("dawn", "midday", …). */
  name: string;
  signal: string;
  dim: string;
};

/*
  Maine daylight phases — the accent's place-based arc through the day,
  coloured to actual sky: warm sand at dawn, bright sky-blue at noon,
  twilight purple at dusk, deep navy at night.
*/
export const PHASES: Record<"dawn" | "day" | "dusk" | "night", Phase> = {
  dawn: { name: "dawn", signal: "#e0a85a", dim: "#c98f43" },
  day: { name: "midday", signal: "#5eb2f0", dim: "#3a8fcf" },
  dusk: { name: "dusk", signal: "#6f7fd6", dim: "#5566bd" },
  night: { name: "night", signal: "#6b78c4", dim: "#5563aa" },
};

const HOUR = 3600000;

/** Which phase of the Portland day a given instant falls in. */
export function phaseAt(now: Date = new Date()): Phase {
  const { sunrise, sunset } = getSunTimes(now);
  const t = now.getTime();
  if (t < sunrise.getTime() - 0.5 * HOUR || t > sunset.getTime() + HOUR) return PHASES.night;
  if (t < sunrise.getTime() + 1.5 * HOUR) return PHASES.dawn;
  if (t > sunset.getTime() - 1.5 * HOUR) return PHASES.dusk;
  return PHASES.day;
}

/** Is the sun up in Portland at this instant? Drives light vs. dark theme. */
export function isDaylight(now: Date = new Date()): boolean {
  try {
    const { sunrise, sunset } = getSunTimes(now);
    const rise = sunrise.getTime();
    const set = sunset.getTime();
    if (!Number.isFinite(rise) || !Number.isFinite(set)) return false;
    const t = now.getTime();
    return t >= rise && t < set;
  } catch {
    return false;
  }
}

export type DayWindow = {
  /** Local Maine midnight that opens the day, as an absolute instant. */
  start: number;
  /** The next local Maine midnight. */
  end: number;
  sunrise: number;
  solarNoon: number;
  sunset: number;
};

const MAINE_TZ = "America/New_York";

/*
  Maine-local midnight for the day containing `now`, as an absolute instant.

  Doing this with the Intl parts rather than setHours() matters: the visitor's
  own clock can be anywhere, and a scrubber labelled "Portland time" that
  silently spans the viewer's midnight instead of Maine's would put sunrise in
  the wrong place on the tape for most of the world.
*/
function maineMidnight(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MAINE_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  // Intl renders midnight as hour 24 in some ICU versions; normalise it.
  const h = get("hour") % 24;
  const elapsed = h * HOUR + get("minute") * 60000 + get("second") * 1000;
  return now.getTime() - elapsed;
}

/** The Maine-local day containing `now`, with its sun marks, for the scrubber. */
export function dayWindow(now: Date = new Date()): DayWindow {
  const start = maineMidnight(now);
  const end = start + 24 * HOUR;
  // Sun marks are computed from the middle of the window so a scrub that
  // starts near either midnight still reads the right day's sunrise.
  const { sunrise, solarNoon, sunset } = getSunTimes(new Date(start + 12 * HOUR));
  return {
    start,
    end,
    sunrise: sunrise.getTime(),
    solarNoon: solarNoon.getTime(),
    sunset: sunset.getTime(),
  };
}

/** Format an instant as Maine wall-clock time, e.g. "4:31 PM". */
export function maineTime(at: number | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MAINE_TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(at);
}

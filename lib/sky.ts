/*
  sky.ts — what colour the Portland sky is, from the sun and the weather.

  The Daylight hero used to be a hard-coded cream gradient: two fixed radial
  washes and a linear ramp, identical at 6am in a snowstorm and at 2pm in
  July. Meanwhile the panel sitting on top of it listed the air temperature,
  the wind, the cloud cover and the tide, each with an arrow claiming it drove
  something on the page. In Daylight none of them did — the one component that
  read those numbers (ReactiveAurora) unmounts in light mode.

  This is the missing half. Given an instant and the current readings it
  returns the colours the hero actually paints, so the sky over the headline
  is the sky outside: the sun's pool tracks across it and sinks at dusk, cloud
  cover flattens and greys it, cold air cools it and warm air warms it.

  Pure math on numbers — no DOM, no network — so DayScrubber can ask it "what
  would 6pm look like?" and get the same answer the clock will give at 6pm.
*/

import { type DayWindow } from "./daylight";

export type Sky = {
  /** Sky colour at the top of the hero. */
  top: string;
  /** Sky colour where it meets the page's cream ground. */
  horizon: string;
  /** The sun (or moon) pool. */
  pool: string;
  /** Pool position, as CSS percentages across and down the hero. */
  poolX: number;
  poolY: number;
  /** Pool strength, 0..1 — cloud cover and nightfall both take it down. */
  poolAlpha: number;
  /** How much cloud deck to draw, 0..1. */
  cloud: number;
  /** Sun altitude, -1 (deep night) .. 1 (solar noon). */
  altitude: number;
};

export type SkyInputs = {
  /** 0..1 from the weather feed; 1 is a clear sky. */
  clarity?: number | null;
  /** Air temperature, °F. */
  tempF?: number | null;
  /** 0..1 moon illumination, used after dark. */
  moon?: number;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (v: number, lo: number, hi: number) => clamp01((v - lo) / (hi - lo));

type Rgb = [number, number, number];

const rgb = (hex: string): Rgb => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

const hex = ([r, g, b]: Rgb) =>
  "#" + [r, g, b].map((v) => Math.round(clamp01(v / 255) * 255).toString(16).padStart(2, "0")).join("");

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/*
  The palette. Every colour here is a *light* colour on purpose — this paints
  behind harbor-navy body text in the theme that ships by default, so even
  midnight stays a pale blue-grey rather than going dark. Harbor mode is where
  the page is allowed to be black.
*/
const NIGHT_TOP = rgb("#c2cadf");
const HORIZON_TOP = rgb("#e6d5c1"); // sun on the horizon, warm
const NOON_TOP = rgb("#c7e0f7"); // overhead, blue
const NIGHT_GROUND = rgb("#e6e6ec");
const GROUND = rgb("#f7f4ef"); // the page's own cream
const WARM_SHIFT = rgb("#f0d9b4"); // where a hot day pulls the sky
const COOL_SHIFT = rgb("#d4e6f4"); // and a cold one

/*
  Cloud does not flatten every sky toward the same grey — that was the first
  version of this, and it made an overcast dawn, midday and dusk render as
  three shades of the same slate, so the day scrubber moved a handle and
  nothing happened. Overcast keeps the time of day: bright and cool at noon,
  dim and warm at the horizon, dim and blue after dark. So the grey it mixes
  toward is itself picked by the sun's altitude.
*/
const OVERCAST_NOON = rgb("#b4c4d6");
const OVERCAST_LOW = rgb("#c0b1a2");
const OVERCAST_NIGHT = rgb("#a7aec3");

const POOL_LOW = rgb("#f0b265"); // sun near the horizon
const POOL_HIGH = rgb("#fff0d2"); // sun overhead
const POOL_MOON = rgb("#e8ecf7");

/**
 * The sky at an instant.
 *
 * `win` comes from dayWindow() so sunrise and sunset are the real Portland
 * ones; `at` is any instant inside it (the clock, or wherever the scrubber
 * is parked).
 */
export function skyAt(at: number, win: DayWindow, input: SkyInputs = {}): Sky {
  const { sunrise, sunset } = win;
  const dayLen = Math.max(1, sunset - sunrise);
  /* Where we are through the daylight arc: 0 at sunrise, 1 at sunset. */
  const through = (at - sunrise) / dayLen;

  /*
    Altitude proxy. A sine across the daylight arc is close enough to the real
    curve for a background, and outside the arc it keeps falling for about an
    hour and a half before bottoming out — which is roughly how long the sky
    stays lit after the sun goes down.
  */
  const TWILIGHT = 1.5 * 3600000;
  let altitude: number;
  if (through >= 0 && through <= 1) {
    altitude = Math.sin(Math.PI * through);
  } else {
    const past = through < 0 ? sunrise - at : at - sunset;
    altitude = -clamp01(past / TWILIGHT);
  }

  const cloud = clamp01(1 - (input.clarity ?? 0.6));
  const moon = clamp01(input.moon ?? 0.5);
  /* 30°F pulls the sky cool, 80°F pulls it warm, 55°F leaves it alone. */
  const warmth = input.tempF == null ? 0.5 : span(input.tempF, 30, 80);

  const lit = clamp01(altitude);
  const dark = clamp01(-altitude);

  /* Daylight colour first: horizon-warm at the ends, blue overhead. */
  let top = mix(HORIZON_TOP, NOON_TOP, lit);
  let horizon = mix(top, GROUND, 0.62);

  /* Then fade that toward night as the sun drops below the horizon. */
  if (dark > 0) {
    top = mix(top, NIGHT_TOP, dark);
    horizon = mix(horizon, NIGHT_GROUND, dark);
  }

  /*
    Temperature is a lean, not a repaint — at most a fifth of the way toward
    warm or cool, and only while the sun is up. A cold night and a mild one
    look the same from indoors.
  */
  const lean = (warmth - 0.5) * 0.4 * lit;
  if (lean > 0) top = mix(top, WARM_SHIFT, lean);
  else if (lean < 0) top = mix(top, COOL_SHIFT, -lean);

  /* Cloud cover pulls toward the overcast of this hour, not a flat slate. */
  const overcast = mix(mix(OVERCAST_LOW, OVERCAST_NOON, lit), OVERCAST_NIGHT, dark);
  top = mix(top, overcast, cloud * 0.62);
  horizon = mix(horizon, overcast, cloud * 0.34);

  /*
    The pool — the sun, tracking left to right and climbing as it goes, then
    sinking off the right-hand side.

    It does not hand over to the moon at the instant of sunset. The first
    version did, and the result was that 6:44pm looked like noon and 6:45pm
    looked like midnight, with no dusk at all — the single most recognisable
    thing a sky does. It now keeps the warm horizon colour and fades it out
    across the twilight, only becoming moonlight once the glow is gone.
    Position is where the sun actually set rather than a real lunar
    ephemeris, which is more astronomy than a background needs.
  */
  const daytime = altitude > 0;
  const x = 8 + clamp01(through) * 84;
  const poolX = through < 0 ? 8 : x;
  const poolY = 80 - lit * 58 + dark * 8;
  const pool = daytime ? mix(POOL_LOW, POOL_HIGH, lit) : mix(POOL_LOW, POOL_MOON, dark);
  /*
    Cloud dims the sun but must not erase it: at 0.72 an overcast day had no
    visible sun anywhere on the arc, so the scrubber's whole journey was one
    flat field. 0.55 keeps a bright patch you can watch move.
  */
  const poolAlpha = daytime
    ? (0.3 + lit * 0.45) * (1 - cloud * 0.55)
    : (0.3 * (1 - dark) + (0.08 + moon * 0.14) * dark) * (1 - cloud * 0.55);

  return {
    top: hex(top),
    horizon: hex(horizon),
    pool: hex(pool),
    poolX,
    poolY,
    poolAlpha: Math.max(0, poolAlpha),
    cloud,
    altitude,
  };
}

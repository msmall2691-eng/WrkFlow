"use client";

import { useEffect, useState } from "react";
import { dayWindow, type DayWindow } from "@/lib/daylight";
import { skyAt, type Sky } from "@/lib/sky";
import { getMoon } from "@/lib/moon";
import { useMaine } from "@/lib/useMaine";

/*
  DaylightSky — the hero background in Daylight, driven by the actual sky.

  What was here before was a static CSS gradient called `.hero-light-bg`:
  terracotta top-right, blue bottom-left, cream ramp, fixed forever. It looked
  fine and it meant nothing. The instrument panel in front of it was listing
  air temperature "→ glow", wind "→ drift" and cloud cover "→ haze" while the
  only component that read any of those numbers unmounted itself in light
  mode. Four live readings, four arrows, nothing moving.

  So the readings drive the sky now:

    · the sun    — a pool of light that tracks across the hero and climbs
                   with the sun's altitude, warm amber at the horizon and
                   near-white overhead, replaced after dark by a much fainter
                   moon pool
    · cloud      — flattens the whole gradient toward overcast grey, dims the
                   sun pool, and thickens the drifting deck
    · wind       — how fast that deck crosses the hero
    · air temp   — a warm or cool lean while the sun is up

  Colour comes from lib/sky.ts, which DayScrubber also drives: dragging the
  handle in the panel walks this sky from dawn to midnight and back. That is
  the whole point of the scrubber, and until now it only changed a button.

  Three things it deliberately does not do. It never goes dark — this is the
  theme that ships, and navy body copy has to stay readable at 11pm, so
  "night" here is a pale blue-grey. It is CSS gradients rather than a canvas,
  so there is no per-frame work behind the headline. And the drift stops
  entirely under prefers-reduced-motion.
*/

/* Pre-hydration and pre-fetch default: a plausible overcast midday, so the
   first paint is already in the right family and the real sky eases in. */
const INITIAL: Sky = {
  top: "#cfdcea",
  horizon: "#efeae3",
  pool: "#f6e6c8",
  poolX: 62,
  poolY: 32,
  poolAlpha: 0.3,
  cloud: 0.45,
  altitude: 0.6,
};

export default function DaylightSky() {
  const d = useMaine();
  const [light, setLight] = useState(true);
  const [win, setWin] = useState<DayWindow | null>(null);
  const [at, setAt] = useState<number | null>(null);
  /* Non-null while DayScrubber is previewing another time of day. */
  const [scrub, setScrub] = useState<number | null>(null);

  useEffect(() => {
    const read = () => setLight(document.documentElement.dataset.theme === "light");
    read();
    window.addEventListener("theme:change", read);
    return () => window.removeEventListener("theme:change", read);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setWin(dayWindow(now));
      setAt(now.getTime());
    };
    tick();
    /* Five minutes is finer than anyone will notice standing still and coarse
       enough to cost nothing; the sun moves about a degree in that time. */
    const id = setInterval(tick, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent).detail as { at: number } | null;
      setScrub(detail ? detail.at : null);
    };
    window.addEventListener("daylight:scrub", on);
    return () => window.removeEventListener("daylight:scrub", on);
  }, []);

  /* Harbor has the aurora; this is the daylight half only. */
  if (!light) return null;

  const sky =
    win && at != null
      ? skyAt(scrub ?? at, win, {
          clarity: d?.conditions?.clarity,
          tempF: d?.tempF,
          moon: getMoon().illumination,
        })
      : INITIAL;

  /*
    Drift speed. A dead calm still moves, just barely — a frozen cloud deck
    reads as a texture rather than as weather — and a gale crosses the hero in
    under a minute.
  */
  const gust = Math.min(1, (d?.wind?.mph ?? 6) / 30);
  const drift = Math.round(240 - gust * 185);

  return (
    <div
      aria-hidden="true"
      className="daylight-sky"
      style={
        {
          "--sky-top": sky.top,
          "--sky-horizon": sky.horizon,
          "--sky-pool": sky.pool,
          "--sky-pool-x": `${sky.poolX}%`,
          "--sky-pool-y": `${sky.poolY}%`,
          "--sky-pool-alpha": sky.poolAlpha,
          "--sky-cloud": sky.cloud,
          "--sky-drift": `${drift}s`,
        } as React.CSSProperties
      }
    >
      <div className="daylight-sky-pool" />
      <div className="daylight-sky-deck" />
    </div>
  );
}

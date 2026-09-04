"use client";

import { useEffect, useState } from "react";
import AuroraSwell from "./AuroraSwell";
import { getMoon } from "@/lib/moon";
import { useMaine } from "@/lib/useMaine";

/*
  ReactiveAurora — the hero swell, tuned to live Portland conditions.

  Three things changed here, all of them things the site already claimed to
  be doing:

  · It reads the shared useMaine cache instead of fetching /api/maine itself.
    That cache exists precisely so the ambient components don't each hit the
    endpoint; this component was the one bypassing it, which is why a page
    load made two identical requests.

  · It unmounts entirely in daylight mode. A CSS rule was meant to hide the
    canvas there, but AuroraSwell sets display:"block" as an inline style,
    which beats a stylesheet rule — so the shader had been running every
    frame behind an opaque cream gradient, painting nothing. Hiding it would
    not have helped either; the render loop only stops if the component goes.

  · Air and water temperature now do something. The readout has always said
    "air → glow" and "water → depth" while nothing read either number.
*/

/** Map a reading onto 0..1, clamped, so an outlier can't blow out the scene. */
const span = (v: number, lo: number, hi: number) =>
  Math.max(0, Math.min(1, (v - lo) / (hi - lo)));

export default function ReactiveAurora() {
  const d = useMaine();
  const [light, setLight] = useState(false);

  useEffect(() => {
    const read = () => setLight(document.documentElement.dataset.theme === "light");
    read();
    window.addEventListener("theme:change", read);
    return () => window.removeEventListener("theme:change", read);
  }, []);

  if (light) return null;

  const clarity = d?.conditions?.clarity;
  let intensity = typeof clarity === "number" ? 0.62 + clarity * 0.55 : 0.78;
  const speed = typeof clarity === "number" ? 0.6 + clarity * 0.45 : 0.8;

  /*
    "Moon → night", the third claim with nothing behind it. After dark the
    swell takes its brightness from how much moon there actually is: a new
    moon leaves the harbour nearly black, a full one lifts it. Daytime is
    unaffected — the sun is the light source then.
  */
  if (d?.night) {
    intensity *= 0.55 + getMoon().illumination * 0.6;
  }

  // 30°F → cold blue highlight, 80°F → low warm sun.
  const warmth = d?.tempF != null ? span(d.tempF, 30, 80) : 0;
  // 68°F sea → no extra depth, 40°F → the darkest floor this allows.
  const depth = d?.waterTempF != null ? 1 - span(d.waterTempF, 40, 68) : 0;

  return (
    <AuroraSwell intensity={intensity} speed={speed} warmth={warmth} depth={depth} />
  );
}

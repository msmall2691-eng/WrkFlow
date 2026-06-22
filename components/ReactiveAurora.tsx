"use client";

import { useEffect, useState } from "react";
import AuroraSwell from "./AuroraSwell";

/*
  ReactiveAurora — the hero swell, tuned to live Portland weather. Clear skies
  glow brighter and livelier; overcast/rain reads dimmer and moodier. Falls
  back to a calm default until conditions load.
*/
export default function ReactiveAurora() {
  const [intensity, setIntensity] = useState(0.78);
  const [speed, setSpeed] = useState(0.8);

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        const c = j?.conditions?.clarity;
        if (typeof c === "number") {
          setIntensity(0.62 + c * 0.55); // overcast ~0.78 → clear ~1.17
          setSpeed(0.6 + c * 0.45); // calmer when grey, livelier when clear
        }
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  return <AuroraSwell intensity={intensity} speed={speed} />;
}

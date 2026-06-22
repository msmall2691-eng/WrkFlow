"use client";

import { useEffect, useState } from "react";
import AuroraSwell from "./AuroraSwell";

/*
  ReactiveAurora — the hero swell, tuned to live Portland weather. Clear skies
  glow brighter and livelier; overcast/rain reads dimmer and moodier. Falls
  back to a calm default until conditions load.
*/
export default function ReactiveAurora() {
  const [intensity, setIntensity] = useState(0.6);
  const [speed, setSpeed] = useState(0.7);

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        const c = j?.conditions?.clarity;
        if (typeof c === "number") {
          setIntensity(0.42 + c * 0.5); // overcast ~0.55 → clear ~0.92
          setSpeed(0.55 + c * 0.4); // calmer when grey, livelier when clear
        }
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  return <AuroraSwell intensity={intensity} speed={speed} />;
}

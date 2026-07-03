"use client";

import { useEffect, useState } from "react";

/*
  useMaine — a shared client cache for /api/maine. Several ambient components
  read the same payload; without this each one would fetch and parse the JSON
  independently on mount. Module-level promise → one fetch, one parse per page
  load. Silent on failure so the ambient layer just stays at defaults.
*/

export type MaineData = {
  place: string;
  tempF: number | null;
  waterTempF: number | null;
  wind: { mph: number; dir: string } | null;
  conditions: { text: string; clarity: number } | null;
  fog: boolean;
  tide: "rising" | "falling" | null;
  nextTide: { type: string; time: string } | null;
  tideLevel: number | null;
  wave: { m: number; amp: number } | null;
  sun: { label: string; time: string } | null;
  light: { label: string; time?: string } | null;
  moon: { phase: string; emoji: string } | null;
  night: boolean;
  sunrise: string;
  sunset: string;
};

let cached: Promise<MaineData | null> | null = null;

function load(): Promise<MaineData | null> {
  if (!cached) {
    cached = fetch("/api/maine")
      .then((r) => (r.ok ? (r.json() as Promise<MaineData>) : null))
      .catch(() => null);
  }
  return cached;
}

export function useMaine(): MaineData | null {
  const [d, setD] = useState<MaineData | null>(null);
  useEffect(() => {
    let on = true;
    load().then((j) => {
      if (on) setD(j);
    });
    return () => {
      on = false;
    };
  }, []);
  return d;
}

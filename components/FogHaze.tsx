"use client";

import { useEffect } from "react";

/*
  FogHaze — on Portland fog/mist/haze days, adds a data flag to the root so
  a very quiet global veil kicks in (see globals.css `[data-fog='1']`). Purely
  ambient — no UI, silent on failure, no layout impact.
*/
export default function FogHaze() {
  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        if (j?.fog === true) document.documentElement.dataset.fog = "1";
      })
      .catch(() => {});
    return () => {
      on = false;
      delete document.documentElement.dataset.fog;
    };
  }, []);
  return null;
}

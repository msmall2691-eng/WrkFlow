"use client";

import { useEffect } from "react";
import { useMaine } from "@/lib/useMaine";

/*
  FogHaze — on Portland fog/mist/haze days, adds a data flag to the root so
  a very quiet global veil kicks in (see globals.css `[data-fog='1']`). Purely
  ambient — no UI, silent on failure, no layout impact.
*/
export default function FogHaze() {
  const d = useMaine();
  useEffect(() => {
    if (d?.fog === true) {
      document.documentElement.dataset.fog = "1";
      return () => {
        delete document.documentElement.dataset.fog;
      };
    }
  }, [d?.fog]);
  return null;
}

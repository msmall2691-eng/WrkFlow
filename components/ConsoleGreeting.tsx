"use client";

import { useEffect } from "react";

/*
  ConsoleGreeting — a friendly note for the technical visitors who open dev tools.
  Quiet personality; zero UI.
*/
export default function ConsoleGreeting() {
  useEffect(() => {
    try {
      console.log(
        "%cBuilt true on the Maine coast.",
        "color:#16a394;font-weight:700;font-size:13px",
      );
      console.log(
        "%cWant one like it? contact@mlinx.studio",
        "color:#8497a8;font-size:12px",
      );
    } catch {
      /* no-op */
    }
  }, []);
  return null;
}

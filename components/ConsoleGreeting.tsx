"use client";

import { useEffect } from "react";

/*
  ConsoleGreeting — a friendly note for the technical visitors who open dev
  tools. One styled log call: a small M STUDIO wordmark in brand colors, then a
  single line about what's live and how to reach out. Zero UI, no tracking.
*/
export default function ConsoleGreeting() {
  useEffect(() => {
    try {
      // Two %c segments then a plain trailing line — all in one call, so
      // devtools shows it as a single entry.
      const wordmark = "\n  ▚  M  STUDIO  \n";
      const tagline =
        "\n  Built on live Maine data — weather, tide, daylight, and buoy 44007 are shaping what you see.\n  Curious how? hello@mlinx.studio\n";
      const install =
        "  ↓ Install this as an app: Chrome URL bar → install icon.  iOS Safari → Share → Add to Home Screen.\n";
      console.log(
        `%c${wordmark}%c${tagline}%c${install}`,
        // Wordmark: sea-glass teal on harbor navy, letter-spaced for calm.
        [
          "background:#0b1722",
          "color:#8bd6c8",
          "font-weight:700",
          "font-size:13px",
          "letter-spacing:0.28em",
          "padding:6px 0",
        ].join(";"),
        // Tagline: muted, one line, no bold.
        [
          "background:#0b1722",
          "color:#aebecb",
          "font-size:12px",
          "line-height:1.55",
          "padding:2px 0 6px",
        ].join(";"),
        // Install hint: quieter still, mono-ish.
        [
          "background:#0b1722",
          "color:#8497a8",
          "font-size:11px",
          "line-height:1.55",
          "padding:0 0 6px",
        ].join(";"),
      );
    } catch {
      /* no-op */
    }
  }, []);
  return null;
}

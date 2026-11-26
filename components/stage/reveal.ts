import type { CSSProperties } from "react";

/**
 * The approved design's per-element reveal delay.
 *
 * It writes `--d`, which the `[data-reveal]` rule in `app/globals.css`
 * reads as its `transition-delay` — the mockup's own mechanism, kept
 * rather than replaced with a utility class per value. Seconds, because
 * that is the unit the design is written in (`--d:.07s`).
 *
 * Keep these small. A stagger is a section arriving in order, not a
 * sequence a visitor has to sit through.
 */
export const delay = (seconds: number): CSSProperties =>
  ({ "--d": `${seconds}s` }) as CSSProperties;

import { Antonio, Instrument_Serif } from "next/font/google";

/*
  Blueprint homepage type (Nov 16 2026). Meg picked two AnimatedWebs demos,
  Ironline Builders and Ostrander Signal, as the look she wants. These two
  faces carry it: Antonio, a condensed grotesk that reads as site signage
  and stencilled drawings, for the big headings; Instrument Serif italic for
  the one soft line under each, so the page is not all hard edges. Body stays
  Inter and readouts stay JetBrains Mono (real data only), both loaded by
  app/layout.tsx. Loaded here rather than in the layout so only the homepage
  pays for them.
*/
export const antonio = Antonio({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-antonio",
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

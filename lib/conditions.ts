import type { MaineData } from "./useMaine";

/*
  conditions — turns the live Portland readout into something a business
  owner would act on. The homepage panel used to show weather as weather;
  this is the same data read the way a field crew reads it.

  Everything here is derived from /api/maine. Nothing is a forecast we do not
  have: the NWS observation is "right now", so the advice is about right now.
*/

export type Sky = "snow" | "rain" | "fog" | "clear" | "cloud";

const SNOW = /(snow|flurr|sleet|wintry|ice)/i;
const RAIN = /(rain|drizzle|shower|storm|thunder)/i;
const FOG = /(fog|mist|haze)/i;
const CLEAR = /(clear|sunny|fair)/i;

export function skyFrom(d: MaineData | null): Sky | null {
  const text = d?.conditions?.text;
  if (!text) return d?.fog ? "fog" : null;
  if (SNOW.test(text)) return "snow";
  if (RAIN.test(text)) return "rain";
  if (d?.fog || FOG.test(text)) return "fog";
  if (CLEAR.test(text)) return "clear";
  return "cloud";
}

/** One line a crew lead would say about today. Null when there is nothing to read yet. */
export function adviceFor(d: MaineData | null): string | null {
  if (!d) return null;
  if (d.night) return `Dark until sunrise at ${d.sunrise}.`;
  // No observation from the Jetport means no basis for weather advice. Saying
  // "good for outdoor work" on missing data would be inventing a reading.
  if (!d.conditions && !d.wind) return null;
  const sky = skyFrom(d);
  const wind = d.wind?.mph ?? 0;
  if (sky === "snow") return "Snow in Portland. Outdoor jobs move, drive times grow.";
  if (sky === "rain") return "Rain in Portland. Exterior work waits for a dry window.";
  if (sky === "fog") return "Fog on the coast. Add drive time between jobs.";
  if (wind >= 25) return `Gusty, ${wind} mph. Ladders and roof work wait.`;
  if (d.light?.label === "golden hour") {
    // /api/maine sets `time` only on the evening window; the morning one has none.
    return d.light.time
      ? `Golden hour until sunset at ${d.sunset}. Best light for photos.`
      : "Morning golden hour. Soft light for photos.";
  }
  return `Good for outdoor work until sunset at ${d.sunset}.`;
}

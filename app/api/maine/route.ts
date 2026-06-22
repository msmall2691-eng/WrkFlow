import { getSunTimes, PORTLAND_ME } from "@/lib/sun";

/*
  /api/maine — a live readout for Portland, Maine: air + water temperature,
  wind, sky conditions, tide state, next sun event / golden hour, and the moon
  phase. NWS + NOAA CO-OPS, computed sun/moon. Edge-cached ~10 min. Every
  upstream call fails soft.
*/

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });
const ymd = (d: Date) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const cardinal = (deg: number) => DIRS[Math.round(deg / 45) % 8];

function clarity(text: string): number {
  const t = text.toLowerCase();
  if (/(rain|shower|drizzle|storm|snow|sleet)/.test(t)) return 0.2;
  if (/(fog|mist|haze)/.test(t)) return 0.3;
  if (/mostly cloudy/.test(t)) return 0.4;
  if (/(overcast|cloudy)/.test(t)) return 0.3;
  if (/partly/.test(t)) return 0.6;
  if (/(mostly clear|mostly sunny|few clouds)/.test(t)) return 0.85;
  if (/(clear|sunny|fair)/.test(t)) return 1;
  return 0.6;
}

function moonPhase(date: Date) {
  const synodic = 29.530588853;
  const knownNew = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  let phase = ((date.valueOf() / 86400000 - knownNew) % synodic) / synodic;
  if (phase < 0) phase += 1;
  const i = Math.round(phase * 8) % 8;
  return {
    phase: ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"][i],
    emoji: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][i],
  };
}

export async function GET() {
  const now = new Date();
  const t = now.getTime();
  const sun = getSunTimes(now);
  const night = t < sun.sunrise.getTime() || t > sun.sunset.getTime();

  let nextSun: { label: string; time: string };
  if (t < sun.sunrise.getTime()) nextSun = { label: "sunrise", time: fmtTime(sun.sunrise) };
  else if (t < sun.sunset.getTime()) nextSun = { label: "sunset", time: fmtTime(sun.sunset) };
  else nextSun = { label: "sunrise", time: fmtTime(getSunTimes(new Date(t + 86400000)).sunrise) };

  // Golden hour — ~70 min around sunrise / sunset.
  const hr = 3600000;
  let light: { label: string; time?: string } | null = null;
  if (t >= sun.sunset.getTime() - 70 * 60000 && t <= sun.sunset.getTime())
    light = { label: "golden hour", time: fmtTime(sun.sunset) };
  else if (t >= sun.sunrise.getTime() && t <= sun.sunrise.getTime() + 70 * 60000)
    light = { label: "golden hour" };

  // Air temp + wind + conditions — NWS (Portland Jetport)
  let tempF: number | null = null;
  let wind: { mph: number; dir: string } | null = null;
  let conditions: { text: string; clarity: number } | null = null;
  try {
    const r = await fetch("https://api.weather.gov/stations/KPWM/observations/latest", {
      headers: { "User-Agent": "mlinx.studio (contact@mlinx.studio)", Accept: "application/geo+json" },
      next: { revalidate: 600 },
    });
    if (r.ok) {
      const p = (await r.json())?.properties ?? {};
      if (typeof p.temperature?.value === "number") tempF = Math.round((p.temperature.value * 9) / 5 + 32);
      if (typeof p.windSpeed?.value === "number") {
        const mph = Math.round(p.windSpeed.value * 2.236936);
        wind = { mph, dir: typeof p.windDirection?.value === "number" ? cardinal(p.windDirection.value) : "" };
      }
      if (typeof p.textDescription === "string" && p.textDescription)
        conditions = { text: p.textDescription, clarity: clarity(p.textDescription) };
    }
  } catch {
    /* fail soft */
  }

  // Water temp — NOAA CO-OPS (Portland 8418150)
  let waterTempF: number | null = null;
  try {
    const r = await fetch(
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature&date=latest&station=8418150&time_zone=gmt&units=english&format=json",
      { next: { revalidate: 600 } },
    );
    if (r.ok) {
      const v = (await r.json())?.data?.[0]?.v;
      if (v != null && !Number.isNaN(Number(v))) waterTempF = Math.round(Number(v));
    }
  } catch {
    /* fail soft */
  }

  // Tide state — NOAA CO-OPS hi/lo, GMT for absolute compare
  let tide: "rising" | "falling" | null = null;
  let nextTide: { type: string; time: string } | null = null;
  try {
    const url =
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions" +
      "&application=mlinx.studio&datum=MLLW&station=8418150&time_zone=gmt&units=english&interval=hilo&format=json" +
      `&begin_date=${ymd(now)}&end_date=${ymd(new Date(t + 2 * 86400000))}`;
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (r.ok) {
      const preds: { t: string; type: string }[] = (await r.json())?.predictions ?? [];
      const next = preds.find((p) => new Date(p.t.replace(" ", "T") + "Z") > now);
      if (next) {
        tide = next.type === "H" ? "rising" : "falling";
        nextTide = { type: next.type === "H" ? "high" : "low", time: fmtTime(new Date(next.t.replace(" ", "T") + "Z")) };
      }
    }
  } catch {
    /* fail soft */
  }

  return Response.json(
    {
      place: PORTLAND_ME.label,
      tempF,
      waterTempF,
      wind,
      conditions,
      tide,
      nextTide,
      sun: nextSun,
      light,
      moon: moonPhase(now),
      night,
      sunrise: fmtTime(sun.sunrise),
      sunset: fmtTime(sun.sunset),
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=1800" } },
  );
}

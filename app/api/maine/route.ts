import { getSunTimes, PORTLAND_ME } from "@/lib/sun";

/*
  /api/maine — a small live readout for Portland, Maine: temperature (NWS),
  tide state (NOAA CO-OPS), and next sun event (computed locally). Cached at
  the edge for 10 minutes. Every upstream call fails soft — the widget renders
  whatever fields come back.
*/

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });

const ymd = (d: Date) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

export async function GET() {
  const now = new Date();
  const sun = getSunTimes(now);

  let nextSun: { label: string; time: string };
  if (now < sun.sunrise) nextSun = { label: "sunrise", time: fmtTime(sun.sunrise) };
  else if (now < sun.sunset) nextSun = { label: "sunset", time: fmtTime(sun.sunset) };
  else nextSun = { label: "sunrise", time: fmtTime(getSunTimes(new Date(now.getTime() + 86400000)).sunrise) };

  // Temperature — NWS Portland Jetport (KPWM)
  let tempF: number | null = null;
  try {
    const r = await fetch("https://api.weather.gov/stations/KPWM/observations/latest", {
      headers: { "User-Agent": "mlinx.studio (contact@mlinx.studio)", Accept: "application/geo+json" },
      next: { revalidate: 600 },
    });
    if (r.ok) {
      const j = await r.json();
      const c = j?.properties?.temperature?.value;
      if (typeof c === "number") tempF = Math.round((c * 9) / 5 + 32);
    }
  } catch {
    /* fail soft */
  }

  // Tides — NOAA CO-OPS Portland, ME (8418150), GMT so we can compare absolutely
  let tide: "rising" | "falling" | null = null;
  let nextTide: { type: string; time: string } | null = null;
  try {
    const url =
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions" +
      "&application=mlinx.studio&datum=MLLW&station=8418150&time_zone=gmt&units=english&interval=hilo&format=json" +
      `&begin_date=${ymd(now)}&end_date=${ymd(new Date(now.getTime() + 2 * 86400000))}`;
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (r.ok) {
      const j = await r.json();
      const preds: { t: string; type: string }[] = j?.predictions ?? [];
      const next = preds.find((p) => new Date(p.t.replace(" ", "T") + "Z") > now);
      if (next) {
        tide = next.type === "H" ? "rising" : "falling";
        nextTide = {
          type: next.type === "H" ? "high" : "low",
          time: fmtTime(new Date(next.t.replace(" ", "T") + "Z")),
        };
      }
    }
  } catch {
    /* fail soft */
  }

  return Response.json(
    {
      place: PORTLAND_ME.label,
      tempF,
      tide,
      nextTide,
      sun: nextSun,
      sunrise: fmtTime(sun.sunrise),
      sunset: fmtTime(sun.sunset),
    },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } },
  );
}

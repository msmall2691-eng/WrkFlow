/*
  fog.ts — is Portland in fog / mist / haze right now? Reads the same NWS
  observation the /api/maine route reads; Next's fetch cache dedupes both
  callers within the same revalidate window (600s), so this doesn't add a
  second upstream request. Fails soft to false — no fog effect when unsure.
*/
export async function getFog(): Promise<boolean> {
  try {
    const r = await fetch("https://api.weather.gov/stations/KPWM/observations/latest", {
      headers: { "User-Agent": "mlinx.studio (contact@mlinx.studio)", Accept: "application/geo+json" },
      next: { revalidate: 600 },
    });
    if (!r.ok) return false;
    const text = (await r.json())?.properties?.textDescription;
    return typeof text === "string" && /(fog|mist|haze)/i.test(text);
  } catch {
    return false;
  }
}

/*
  Sites allowed to send Instant Quote leads through mlinx.studio
  (/api/widget-lead). Nov 16 2026.

  The registry lives in the WIDGET_SITES environment variable on Vercel, not
  in the repo, because each entry holds a client's email address:

    WIDGET_SITES='{
      "ledgeview": {
        "business": "Ledgeview Lawn & Garden",
        "to": "owner@ledgeview.example",
        "origins": ["https://ledgeview.example", "https://www.ledgeview.example"]
      }
    }'

  The widget sends only the key. The recipient comes from here, never from
  the request, and the request's Origin must be one of that site's origins,
  so the route cannot be used as an open mail relay.
*/

export type WidgetSite = { business: string; to: string; origins: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function widgetSites(): Record<string, WidgetSite> {
  const raw = process.env.WIDGET_SITES;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<WidgetSite>>;
    const out: Record<string, WidgetSite> = {};
    for (const [key, v] of Object.entries(parsed)) {
      if (!v || typeof v.to !== "string" || !EMAIL_RE.test(v.to)) continue;
      const origins = Array.isArray(v.origins) ? v.origins.filter((o) => typeof o === "string") : [];
      if (!origins.length) continue;
      out[key] = { business: typeof v.business === "string" ? v.business : key, to: v.to, origins };
    }
    return out;
  } catch {
    console.error("WIDGET_SITES is not valid JSON.");
    return {};
  }
}

export function siteFor(key: unknown, origin: string | null): WidgetSite | null {
  if (typeof key !== "string" || !origin) return null;
  const site = widgetSites()[key];
  if (!site) return null;
  return site.origins.includes(origin) ? site : null;
}

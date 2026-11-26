import { NextResponse } from "next/server";

/*
  Site health check — proxies Google PageSpeed Insights (Lighthouse) so the
  Playground tool can return real performance/SEO/accessibility scores for any
  public URL. Works without a key at low quota; set PAGESPEED_API_KEY in env to
  raise the limit. No data is stored.
*/

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PSI = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

type Category = "performance" | "accessibility" | "best-practices" | "seo";

function normalizeUrl(raw: string): string | null {
  let candidate = raw.trim();
  if (!candidate) return null;
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;
  try {
    const u = new URL(candidate);
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = normalizeUrl(searchParams.get("url") ?? "");
  const strategy = searchParams.get("strategy") === "desktop" ? "desktop" : "mobile";

  if (!url) {
    return NextResponse.json(
      { error: "Enter a valid website address, e.g. example.com" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams();
  params.set("url", url);
  params.set("strategy", strategy);
  (["performance", "accessibility", "best-practices", "seo"] as Category[]).forEach((c) =>
    params.append("category", c),
  );
  if (process.env.PAGESPEED_API_KEY) params.set("key", process.env.PAGESPEED_API_KEY);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const res = await fetch(`${PSI}?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const status = res.status;
      const msg =
        status === 429
          ? "The check is busy right now (rate limited). Give it a minute and try again."
          : status === 400 || status === 404
            ? "Couldn't reach that URL. Check the address and that the site is public."
            : "The check failed. Try again in a moment.";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = await res.json();
    const lh = data?.lighthouseResult;
    if (!lh) {
      return NextResponse.json(
        { error: "No results came back for that URL." },
        { status: 502 },
      );
    }

    const cat = (id: Category) => {
      const score = lh.categories?.[id]?.score;
      return typeof score === "number" ? Math.round(score * 100) : null;
    };
    const metric = (id: string) => lh.audits?.[id]?.displayValue ?? null;

    return NextResponse.json({
      finalUrl: lh.finalDisplayedUrl ?? lh.requestedUrl ?? url,
      strategy,
      scores: {
        performance: cat("performance"),
        accessibility: cat("accessibility"),
        bestPractices: cat("best-practices"),
        seo: cat("seo"),
      },
      metrics: {
        fcp: metric("first-contentful-paint"),
        lcp: metric("largest-contentful-paint"),
        cls: metric("cumulative-layout-shift"),
        tbt: metric("total-blocking-time"),
        speedIndex: metric("speed-index"),
      },
    });
  } catch (err) {
    clearTimeout(timeout);
    const aborted = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted
          ? "That check took too long. The site may be slow or blocking the test."
          : "The check failed. Try again in a moment.",
      },
      { status: aborted ? 504 : 502 },
    );
  }
}

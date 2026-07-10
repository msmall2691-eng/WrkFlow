/*
  Lightweight in-memory rate limiter shared by the contact form and the
  free-tool lead capture endpoint. Lives in the function instance's memory,
  so on serverless it's best-effort (resets on cold start, not shared across
  instances) — enough to blunt casual spam without extra infrastructure.
*/
type Entry = { count: number; resetAt: number };

export function createRateLimiter({ windowMs, maxHits }: { windowMs: number; maxHits: number }) {
  const hits = new Map<string, Entry>();

  return function rateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now > entry.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      // Opportunistic cleanup so the map can't grow unbounded.
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
      }
      return false;
    }
    entry.count += 1;
    return entry.count > maxHits;
  };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

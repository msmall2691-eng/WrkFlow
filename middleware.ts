import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
  Subdomain routing — intake.mlinx.studio serves the new-client project
  questionnaire (app/intake/page.tsx).

  Rewriting rather than redirecting keeps the client on the short, speakable
  hostname the whole way through ("go to intake dot mlinx dot studio"), which
  is the entire reason for having a subdomain instead of a path. The path
  form, mlinx.studio/intake, keeps working either way — the same page is
  meant to be reachable both ways.

  Everything on the subdomain maps into /intake/*, so the questionnaire host
  exposes the questionnaire and nothing else — intake.mlinx.studio/pricing is
  a 404, not a second copy of the marketing site on a second hostname.
  Requests for a filename (anything with an extension) are left alone so
  public/ assets and the service worker still resolve.

  The www. variant is matched because a registrar or a link-formatter will
  happily produce it; whether it actually resolves depends on a DNS record
  and a certificate existing for that name too.
*/
const QUESTIONNAIRE_HOSTS = new Set([
  "intake.mlinx.studio",
  "www.intake.mlinx.studio",
  "intake.localhost",
]);

function questionnaireRewrite(request: NextRequest): URL | null {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!QUESTIONNAIRE_HOSTS.has(hostname)) return null;

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/intake")) return null;
  if (pathname.includes(".")) return null; // /sw.js, /shots/x.png, …

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/intake" : `/intake${pathname}`;
  return url;
}

/*
  Nonce-based CSP — replaces 'unsafe-inline' on script-src with a per-request
  nonce, per Next.js's documented pattern
  (https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy).
  A random nonce is minted on every request, forwarded to Server Components via
  the `x-nonce` request header (read in app/layout.tsx and applied to our two
  inline <script> tags), and Next.js automatically applies it to the inline
  scripts it injects itself for hydration/streaming. 'strict-dynamic' lets
  those trusted scripts load their own code-split chunks without having to
  allowlist every chunk URL.

  style-src intentionally keeps 'unsafe-inline' (see next.config.ts) — nonces
  can't attach to inline `style="..."` attributes at all, only to <style>
  elements, and this codebase relies on inline style attributes throughout
  (animation delays, dynamic colors, etc.). script-src is the meaningful
  attack surface; this is where hardening it actually matters.

  Everything else in the policy mirrors next.config.ts's securityHeaders,
  which no longer sets Content-Security-Policy — this is the single source
  of truth for it now.
*/
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `manifest-src 'self'`,
    `frame-src https://the-remote-admin.com https://*.the-remote-admin.com https://maineclean.co https://*.maineclean.co https://autopilot.mlinx.studio`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // The subdomain rewrite has to carry the nonce headers too, or the
  // questionnaire renders without one and CSP blocks its own hydration.
  const rewriteUrl = questionnaireRewrite(request);

  /*
    The intake previously defaulted to Daylight; per Meg it now opens in the
    same dark "Harbor" theme as the rest of the site, so the questionnaire
    reads as one continuous surface with mlinx.studio. The x-theme-default
    plumbing in app/layout.tsx stays (absent header = dark), and a visitor
    who explicitly chose a theme still keeps their choice.
  */

  const response = rewriteUrl
    ? NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets, image optimization, and API routes — none of them
    // render HTML/scripts that need a CSP nonce.
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

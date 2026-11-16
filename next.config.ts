import type { NextConfig } from "next";

/*
  Security headers — applied to every response.

  These are what make a browser (and a security scanner) trust the site:
  - HSTS forces HTTPS so a link can never silently downgrade to http://
  - frame-ancestors / X-Frame-Options stop the site being embedded in someone
    else's page to trick your visitors (clickjacking).
  - nosniff, Referrer-Policy and Permissions-Policy close smaller leaks.

  Content-Security-Policy is NOT set here — it's minted per-request in
  middleware.ts instead, so script-src can carry a fresh nonce on every load
  instead of 'unsafe-inline'. Keeping two separate places that both set CSP
  would have the browser enforce the intersection of both, which is
  confusing to reason about; middleware.ts is the single source of truth.
*/
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
    Nov 15 2026: /services, /marketplace and /demo each listed what is for
    sale, three different ways. They fold into /catalog; permanent redirects
    keep every old link and shared post working. Hashes survive a redirect
    in the browser, so /services#pricing lands on /catalog#pricing.
    The three demos themselves (/demo/shop etc.) are unchanged.
  */
  async redirects() {
    return [
      { source: "/services", destination: "/catalog", permanent: true },
      { source: "/marketplace", destination: "/catalog", permanent: true },
      { source: "/demo", destination: "/catalog", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

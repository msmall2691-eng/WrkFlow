import type { NextConfig } from "next";

/*
  Security headers — applied to every response.

  These are what make a browser (and a security scanner) trust the site:
  - HSTS forces HTTPS so a link can never silently downgrade to http://
  - The CSP constrains where scripts/styles/images/connections may come from,
    which is the main defense against cross-site scripting (XSS) and injected
    content.
  - frame-ancestors / X-Frame-Options stop the site being embedded in someone
    else's page to trick your visitors (clickjacking).
  - nosniff, Referrer-Policy and Permissions-Policy close smaller leaks.

  CSP notes: this is a static marketing site rendered by Next.js, which injects
  a small amount of inline JavaScript for hydration, so script-src must allow
  'unsafe-inline'. 'unsafe-eval' is only needed by React's dev refresh, so it is
  added in development only. When analytics is added later, add its script and
  connect origins to the lists below (e.g. https://va.vercel-scripts.com and
  https://*.vercel-insights.com for Vercel Analytics).
*/
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `object-src 'none'`,
  // Next.js hydration uses inline scripts; dev also needs eval for fast refresh.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind ships a static stylesheet, but React/inline style attributes and
  // next/font need 'unsafe-inline' for styles (style injection is low risk).
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  // The browser only talks to our own origin; third-party calls happen
  // server-side in the API routes, which CSP does not govern.
  `connect-src 'self'`,
  `manifest-src 'self'`,
  `frame-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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

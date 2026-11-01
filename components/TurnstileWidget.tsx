"use client";

import Script from "next/script";

/*
  The Turnstile checkbox, rendered inside a form.

  Renders nothing at all until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so the
  form looks and behaves exactly as it does today until Meg adds the keys
  (see lib/turnstile.ts for the two env vars and where to get them).

  The widget writes a hidden input named `cf-turnstile-response` into the
  enclosing form, which is why nothing in the submit path had to change:
  Contact builds its payload with FormData, so the token is picked up with
  the rest of the fields.

  On the script tag: this site's CSP is `script-src 'self' 'nonce-…'
  'strict-dynamic'`, and under strict-dynamic a host allowlist is ignored
  entirely — adding challenges.cloudflare.com to script-src would do nothing.
  What works is loading it from a script the nonce already trusts, which is
  what next/script does from the nonced bundle. The widget's iframe is a
  separate matter and needs the frame-src entry added in middleware.ts.
*/
export default function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      {/*
        `cf-turnstile` is the class Cloudflare's script looks for. The theme
        is explicit rather than auto: the site's own theme is a data
        attribute the widget cannot see, so auto would read the OS setting
        and could put a dark widget on the light page.
      */}
      <div
        className="cf-turnstile mt-4"
        data-sitekey={siteKey}
        data-theme="light"
        data-size="flexible"
      />
    </>
  );
}

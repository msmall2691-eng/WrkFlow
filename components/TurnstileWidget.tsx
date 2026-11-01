"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

/*
  The Turnstile checkbox, rendered inside a form.

  Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so the form
  looks and behaves exactly as it does today until Meg adds the keys (see
  lib/turnstile.ts for the two env vars and where to get them).

  Explicit rendering, not implicit. The first version used Cloudflare's
  implicit mode: drop a .cf-turnstile div on the page and let api.js find it.
  That scans once, when the script loads, which is wrong for this form twice
  over. Contact swaps the whole form for a success panel on submit, so
  "Send another" mounts a brand new container that the already-loaded script
  never looks at; and arriving at a page through a client-side nav mounts
  one the same way. Either leaves an empty box, no token, and a 403 on the
  next submit. Rendering on mount and removing on unmount is what Cloudflare
  recommends for a form that comes and goes.

  `onReady` rather than `onLoad`: next/script fires onReady on every mount,
  including when the script is already cached, which is exactly the remount
  case above.

  The widget writes its token into the enclosing form as a hidden input
  named cf-turnstile-response, so the submit path stays untouched: Contact
  posts FormData and the token rides along with the other fields.

  On the script tag: this site's CSP is `script-src 'self' 'nonce-…'
  'strict-dynamic'`, and under strict-dynamic a host allowlist is ignored
  entirely — adding challenges.cloudflare.com to script-src would do
  nothing. What works is loading it from a script the nonce already trusts,
  which is what next/script does from the nonced bundle. The widget's iframe
  is a separate matter and needs the frame-src entry in middleware.ts.
*/

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string | undefined;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function TurnstileWidget({
  /*
    Bumped by Contact when a submission fails. A Turnstile token is
    single-use, so the one still sitting in the form after a failed POST is
    spent: retrying with it gets `timeout-or-duplicate` from Cloudflare and
    another 403, which would strand a visitor on a form that cannot be sent
    until they reload the page. Changing this asks Cloudflare for a fresh
    one.
  */
  resetSignal = 0,
}: {
  resetSignal?: number;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const render = useCallback(() => {
    if (!siteKey || !holder.current || widgetId.current) return;
    const api = window.turnstile;
    if (!api) return;
    widgetId.current =
      api.render(holder.current, {
        sitekey: siteKey,
        /*
          Explicit, not "auto": the site's theme is a data attribute the
          widget cannot see, so auto would follow the OS setting and could
          drop a dark widget onto the light page.
        */
        theme: "light",
        size: "flexible",
      }) ?? null;
  }, [siteKey]);

  /* Covers the mount where the script was already loaded and onReady has
     fired before this effect, as well as a late-arriving api.js. */
  useEffect(() => {
    render();
    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [render]);

  useEffect(() => {
    if (resetSignal > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  }, [resetSignal]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={render}
      />
      <div ref={holder} className="mt-4" />
    </>
  );
}

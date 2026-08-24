/*
  M Studio service worker — the minimum a browser needs to consider the site
  installable. No caching, no offline behavior — this site is a live
  marketing surface, not an app to run without connectivity.

  API calls and all non-GET requests are deliberately NOT mediated: a fetch
  routed through respondWith() lives and dies with the worker, and mobile
  browsers (iOS Safari especially) terminate idle workers after ~30s. The
  intake form's concept generation runs close to a minute — mediating it
  meant the worker was killed mid-request and the visitor saw "response
  served by service worker is an error". Returning without respondWith()
  hands the request straight to the network, out of the worker's lifetime.
*/
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/")) return;
  event.respondWith(fetch(event.request).catch(() => Response.error()));
});

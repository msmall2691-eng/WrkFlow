/*
  M Studio service worker — the minimum a browser needs to consider the site
  installable. Takes over as soon as it's ready, then passes every request
  through to the network unchanged. No caching, no offline behavior — this
  site is a live marketing surface, not an app to run without connectivity.
*/
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => Response.error()));
});

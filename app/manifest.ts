import type { MetadataRoute } from "next";

/*
  Web App Manifest — makes the site installable as a standalone app on
  desktop Chrome / Edge (URL-bar install icon) and iOS Safari ("Add to
  Home Screen"). Icons live at /pwa-icon-192.png and /pwa-icon-512.png,
  generated on demand by Route Handlers under app/pwa-icon-*.png/route.tsx.
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "M Studio",
    short_name: "M Studio",
    description:
      "Custom websites, apps, and the systems behind them — designed around how you actually work, then handed over, yours to keep. Built on the Maine coast.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1722",
    theme_color: "#0b1722",
    orientation: "portrait",
    categories: ["business", "productivity", "design"],
    icons: [
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}

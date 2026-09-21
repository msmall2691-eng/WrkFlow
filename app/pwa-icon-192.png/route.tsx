import { ImageResponse } from "next/og";

/*
  PWA icon — 192x192. Same faceted gradient "M" badge as the favicon and
  apple-touch icon, scaled for the manifest. Purpose "any" (no maskable
  safe-zone padding), so the beacon dot sits with a comfortable inset in
  case a launcher still applies its own circular mask.
*/
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #0f2130 0%, #16293a 55%, #123a35 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.22), transparent 58%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: 118,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            color: "#d9a441",
            opacity: 0.55,
            transform: "translate(6px, 6px)",
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 118,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            backgroundImage: "linear-gradient(135deg, #7fe9dc 0%, #2dd4bf 45%, #d9a441 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          M
        </div>
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 26,
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 9999,
            background: "#d9a441",
            boxShadow: "0 0 9px 2px rgba(217,164,65,0.75)",
          }}
        />
      </div>
    ),
    { width: 192, height: 192, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}

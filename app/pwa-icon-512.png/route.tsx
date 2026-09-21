import { ImageResponse } from "next/og";

/*
  PWA icon — 512x512. Same faceted gradient "M" badge as the 192, apple-touch
  icon, and favicon, scaled up for splash + high-DPI.
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
            fontSize: 316,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            color: "#d9a441",
            opacity: 0.55,
            transform: "translate(16px, 16px)",
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 316,
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
            top: 62,
            right: 68,
            display: "flex",
            width: 38,
            height: 38,
            borderRadius: 9999,
            background: "#d9a441",
            boxShadow: "0 0 26px 6px rgba(217,164,65,0.75)",
          }}
        />
      </div>
    ),
    { width: 512, height: 512, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}

import { ImageResponse } from "next/og";

/*
  PWA icon — 512x512. Same design as the 192, scaled up for splash + high-DPI.
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          background: "#0b1722",
          backgroundImage:
            "radial-gradient(circle at 50% 28%, rgba(22,163,148,0.32), transparent 60%)",
        }}
      >
        <div style={{ fontSize: 316, fontWeight: 800, color: "#eef2f4", fontFamily: "Arial, sans-serif", lineHeight: 1 }}>
          M
        </div>
        <div style={{ width: 148, height: 16, borderRadius: 8, background: "#16a394" }} />
      </div>
    ),
    { width: 512, height: 512, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}

import { ImageResponse } from "next/og";

/*
  PWA icon — 192x192. Same M-on-harbor-navy identity as the apple-touch icon,
  scaled for the manifest. Purpose "any" (no maskable safe-zone padding).
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
          gap: 10,
          background: "#0b1722",
          backgroundImage:
            "radial-gradient(circle at 50% 28%, rgba(22,163,148,0.3), transparent 60%)",
        }}
      >
        <div style={{ fontSize: 118, fontWeight: 800, color: "#eef2f4", fontFamily: "Arial, sans-serif", lineHeight: 1 }}>
          M
        </div>
        <div style={{ width: 56, height: 6, borderRadius: 3, background: "#16a394" }} />
      </div>
    ),
    { width: 192, height: 192, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}

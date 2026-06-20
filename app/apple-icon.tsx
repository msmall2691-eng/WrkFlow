import { ImageResponse } from "next/og";

// Apple touch icon — M Studio mark on harbor navy with an accent underline.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            "radial-gradient(circle at 50% 28%, rgba(22,163,148,0.28), transparent 60%)",
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 800, color: "#eef2f4", fontFamily: "Arial, sans-serif", lineHeight: 1 }}>
          M
        </div>
        <div style={{ width: 52, height: 6, borderRadius: 3, background: "#16a394" }} />
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Workflow Studio — Own your operations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "80px",
          backgroundImage:
            "radial-gradient(circle at 75% 15%, rgba(45,226,196,0.16), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#2de2c4",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#2de2c4" }} />
          Systems &amp; Automation Studio
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#f4f4f5",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          <span>Stop renting your workflow.</span>
          <span style={{ color: "#2de2c4" }}>Own your systems.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#a1a1aa",
            fontSize: 28,
          }}
        >
          <span style={{ color: "#f4f4f5", fontWeight: 600 }}>
            Workflow Studio
          </span>
          <span>workflow-studio.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "M Studio — custom websites & software, Maine";
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
          background: "#0b1722",
          padding: "80px",
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(217,164,65,0.20), transparent 52%), radial-gradient(circle at 12% 88%, rgba(22,163,148,0.20), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#16a394",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#16a394" }} />
          Independent web &amp; software studio
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#eef2f4",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          <span>Custom websites, tools &amp; plugins,</span>
          <span style={{ color: "#d9a441" }}>built for the way you work.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#70859a",
            fontSize: 28,
          }}
        >
          <span
            style={{
              color: "#eef2f4",
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            M Studio
          </span>
          <span>mlinx.studio</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

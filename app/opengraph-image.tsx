import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "M Studio — custom websites & software, built on the Maine coast";
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
          padding: "76px",
          backgroundImage:
            "radial-gradient(circle at 80% 14%, rgba(217,164,65,0.22), transparent 50%), radial-gradient(circle at 8% 92%, rgba(22,163,148,0.24), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#16a394",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#16a394" }} />
          Independent web &amp; software studio · Maine
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#eef2f4",
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            <span>Whatever you dream up,</span>
            <span style={{ color: "#d9a441" }}>we&apos;ll build it.</span>
          </div>
          <div style={{ display: "flex", color: "#aebecb", fontSize: 30, letterSpacing: -0.5 }}>
            Custom websites, tools &amp; the systems behind them.
          </div>
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
          <span style={{ color: "#eef2f4", fontWeight: 700, fontFamily: "monospace", letterSpacing: 1 }}>
            M Studio
          </span>
          <span>mlinx.studio</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tide & True Studios — Websites, automations & systems that run better";
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
          background: "#ffffff",
          padding: "80px",
          backgroundImage:
            "radial-gradient(circle at 75% 15%, rgba(37,99,235,0.12), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#2563eb",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#2563eb" }} />
          Web · Automation · Systems Studio
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#18181b",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          <span>Websites &amp; automations</span>
          <span style={{ color: "#2563eb" }}>that make it run better.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#71717a",
            fontSize: 28,
          }}
        >
          <span
            style={{
              color: "#18181b",
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: 4,
            }}
          >
            TIDE&True Studios
          </span>
          <span>tideandtrue.co</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

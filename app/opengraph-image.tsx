import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "M Studio — custom websites & software, built on the Maine coast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Teal → sand, the same arc as the site's hero wordmark.
const WORDMARK = "linear-gradient(135deg, #16a394 0%, #5ec9bd 38%, #e8c98f 72%, #d9a441 100%)";
const GOLD = "linear-gradient(100deg, #d9a441, #f3d79a 50%, #d9a441)";

export default async function OpengraphImage() {
  const [display, mono] = await Promise.all([
    fetch(new URL("./og-fonts/Sora-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./og-fonts/JetBrainsMono-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "#08131d",
          fontFamily: "Sora",
        }}
      >
        {/* Aurora swell — teal + brass, like the live hero backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(62% 80% at 86% 80%, rgba(22,163,148,0.32), transparent 60%), radial-gradient(55% 70% at 78% 6%, rgba(217,164,65,0.22), transparent 60%)",
          }}
        />

        {/* Ghost M STUDIO wordmark — the brand's signature element, on the right */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            opacity: 0.42,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 300,
              fontWeight: 700,
              lineHeight: 0.8,
              letterSpacing: -10,
              backgroundImage: WORDMARK,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            M
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: 2,
              backgroundImage: WORDMARK,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            STUDIO
          </div>
        </div>

        {/* Diagonal scrim — keeps the left text crisp */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(105deg, rgba(8,19,29,0.92) 0%, rgba(8,19,29,0.55) 46%, rgba(8,19,29,0) 80%)",
          }}
        />

        {/* Foreground content — mirrors the hero composition */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 76,
            width: "70%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#5ec9bd",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "JetBrains Mono",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#16a394", display: "flex" }} />
            Independent web &amp; software studio · Maine
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            <span style={{ color: "#eef2f4" }}>Websites and workflows,</span>
            <span
              style={{
                backgroundImage: GOLD,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              custom-made for your projects.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, fontFamily: "JetBrains Mono" }}>
            <span style={{ color: "#aebecb" }}>Built on the Maine coast</span>
            <span style={{ color: "#eef2f4", letterSpacing: 1 }}>mlinx.studio</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Sora", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 700, style: "normal" },
      ],
    },
  );
}

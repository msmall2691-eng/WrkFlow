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
    fetch(new URL("./og-fonts/SpaceGrotesk-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
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
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Aurora swell — brighter teal + brass for more glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(60% 78% at 84% 78%, rgba(22,163,148,0.48), transparent 62%), radial-gradient(54% 66% at 80% 4%, rgba(217,164,65,0.34), transparent 62%), radial-gradient(50% 60% at 12% 30%, rgba(22,163,148,0.16), transparent 70%)",
          }}
        />

        {/* Soft glow pool behind the wordmark */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 90,
            width: 620,
            height: 460,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 55% 50%, rgba(22,163,148,0.40), rgba(217,164,65,0.16) 45%, transparent 72%)",
          }}
        />

        {/* Ghost M STUDIO wordmark — the brand's signature, now glowing */}
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
            opacity: 0.6,
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
              textShadow: "0 0 60px rgba(22,163,148,0.55)",
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
              textShadow: "0 0 40px rgba(217,164,65,0.4)",
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
              "linear-gradient(105deg, rgba(8,19,29,0.9) 0%, rgba(8,19,29,0.5) 48%, rgba(8,19,29,0) 82%)",
          }}
        />

        {/* Foreground content */}
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
              color: "#6fdccf",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "JetBrains Mono",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#16a394", display: "flex" }} />
            Independent web &amp; software studio
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            <span style={{ color: "#f4f8fa", textShadow: "0 0 30px rgba(110,220,207,0.25)" }}>Websites and workflows,</span>
            <span
              style={{
                backgroundImage: GOLD,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 34px rgba(217,164,65,0.4)",
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
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 700, style: "normal" },
      ],
    },
  );
}

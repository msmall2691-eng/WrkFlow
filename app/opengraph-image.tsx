import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "M Studio — custom websites & software, built on the Maine coast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        {/* Aurora swell — bright, like the live hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(60% 78% at 84% 78%, rgba(22,163,148,0.52), transparent 62%), radial-gradient(54% 66% at 80% 4%, rgba(217,164,65,0.34), transparent 62%), radial-gradient(50% 60% at 10% 26%, rgba(22,163,148,0.18), transparent 70%)",
          }}
        />
        {/* Glow pool behind the wordmark */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 80,
            width: 600,
            height: 480,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 55% 50%, rgba(22,163,148,0.42), rgba(217,164,65,0.16) 45%, transparent 72%)",
          }}
        />
        {/* Ghost wordmark */}
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            opacity: 0.4,
          }}
        >
          <div style={{ display: "flex", fontSize: 230, fontWeight: 700, lineHeight: 0.8, letterSpacing: -8, backgroundImage: WORDMARK, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", textShadow: "0 0 55px rgba(22,163,148,0.5)" }}>
            M
          </div>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 700, letterSpacing: 2, backgroundImage: WORDMARK, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            STUDIO
          </div>
        </div>
        {/* Scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(105deg, rgba(8,19,29,0.92) 0%, rgba(8,19,29,0.55) 50%, rgba(8,19,29,0) 84%)",
          }}
        />

        {/* Foreground — the hero, faithfully */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, padding: 70, width: "66%" }}>
          {/* eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#6fdccf", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#16a394", display: "flex" }} />
            Available for new projects
          </div>

          {/* headline */}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 52, fontWeight: 700, lineHeight: 1.04, letterSpacing: -1.5 }}>
            <span style={{ color: "#f4f8fa" }}>Websites and workflows,</span>
            <span style={{ backgroundImage: GOLD, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", textShadow: "0 0 30px rgba(217,164,65,0.35)" }}>
              custom-made for your projects.
            </span>
          </div>

          {/* sub */}
          <div style={{ display: "flex", color: "#c2d0da", fontSize: 22, letterSpacing: -0.3 }}>
            Built by someone who ran the business first — then built the software it needed.
          </div>

          {/* buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#16a394", color: "#ffffff", fontSize: 20, fontWeight: 700, padding: "12px 24px", borderRadius: 9999 }}>
              Start a conversation →
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#eef2f4", fontSize: 20, fontWeight: 500, padding: "12px 24px", borderRadius: 9999, border: "1px solid rgba(238,242,244,0.28)" }}>
              See the work
            </div>
          </div>

          {/* live chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, padding: "8px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(8,19,29,0.55)", fontFamily: "JetBrains Mono", fontSize: 16, color: "#aebecb" }}>
            <div style={{ width: 8, height: 8, borderRadius: 9999, background: "#16a394", display: "flex" }} />
            <span style={{ color: "#6fdccf" }}>LIVE</span>
            <span>Portland, ME · weather · tide · Maine daylight</span>
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

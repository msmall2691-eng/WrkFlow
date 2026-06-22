import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "M Studio — custom websites & software, built on the Maine coast";
// Rendered at 2× (2400×1260) so it stays crisp on hi-res desktop feeds.
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

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
        {/* Aurora — brighter Harbor-blue swell for a cooler, more atmospheric card */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(58% 80% at 82% 74%, rgba(47,109,240,0.55), transparent 60%), radial-gradient(50% 64% at 86% 8%, rgba(217,164,65,0.22), transparent 60%), radial-gradient(54% 64% at 6% 26%, rgba(47,109,240,0.20), transparent 70%), radial-gradient(40% 50% at 70% 92%, rgba(111,211,198,0.16), transparent 70%)",
          }}
        />
        {/* Glow pool behind the wordmark */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 140,
            width: 1280,
            height: 1000,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 52% 50%, rgba(47,109,240,0.34), transparent 70%)",
          }}
        />
        {/* Ghost M STUDIO — faint white, like the hero, with a soft glow */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            color: "#eef2f4",
            opacity: 0.15,
          }}
        >
          <div style={{ display: "flex", fontSize: 500, fontWeight: 700, lineHeight: 0.8, letterSpacing: -16, textShadow: "0 0 80px rgba(47,109,240,0.6)" }}>M</div>
          <div style={{ display: "flex", fontSize: 148, fontWeight: 700, letterSpacing: 4 }}>STUDIO</div>
        </div>
        {/* Scrim — keeps the left text crisp */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(105deg, rgba(8,19,29,0.92) 0%, rgba(8,19,29,0.55) 52%, rgba(8,19,29,0) 84%)",
          }}
        />

        {/* Foreground */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", gap: 52, padding: 152, width: "66%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#9db8f5", fontSize: 42, letterSpacing: 8, textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>
            <div style={{ width: 20, height: 20, borderRadius: 9999, background: "#2f6df0", display: "flex" }} />
            Available for new projects
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
            <span style={{ color: "#f4f8fa" }}>Websites and workflows,</span>
            <span style={{ backgroundImage: GOLD, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
              custom-made for your projects.
            </span>
          </div>

          <div style={{ display: "flex", color: "#c2d0da", fontSize: 46, letterSpacing: -0.6 }}>
            Built by someone who ran the business first — then built the software it needed.
          </div>

          {/* Live chip — the Maine-data feature */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8, padding: "20px 32px", borderRadius: 24, border: "2px solid rgba(255,255,255,0.14)", background: "rgba(8,19,29,0.6)", fontFamily: "JetBrains Mono", fontSize: 32, color: "#aebecb", alignSelf: "flex-start" }}>
            <div style={{ width: 16, height: 16, borderRadius: 9999, background: "#2f6df0", display: "flex" }} />
            <span style={{ color: "#9db8f5" }}>LIVE</span>
            <span>Portland, ME · weather · tide · Maine daylight</span>
          </div>

          <div style={{ display: "flex", marginTop: 4, color: "#8497a8", fontSize: 44, fontFamily: "JetBrains Mono", letterSpacing: 2 }}>
            mlinx.studio
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

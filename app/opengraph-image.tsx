import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "M Studio — custom websites & software, built on the Maine coast";
export const size = { width: 1200, height: 630 };
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
        {/* Aurora — Harbor blue, like the live hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(60% 80% at 84% 78%, rgba(47,109,240,0.42), transparent 62%), radial-gradient(52% 64% at 80% 6%, rgba(217,164,65,0.18), transparent 62%), radial-gradient(48% 60% at 8% 24%, rgba(47,109,240,0.16), transparent 70%)",
          }}
        />
        {/* Ghost M STUDIO — faint white, exactly like the hero wordmark */}
        <div
          style={{
            position: "absolute",
            right: 64,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            color: "#eef2f4",
            opacity: 0.14,
          }}
        >
          <div style={{ display: "flex", fontSize: 250, fontWeight: 700, lineHeight: 0.8, letterSpacing: -8 }}>M</div>
          <div style={{ display: "flex", fontSize: 74, fontWeight: 700, letterSpacing: 2 }}>STUDIO</div>
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
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, padding: 76, width: "66%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#9db8f5", fontSize: 21, letterSpacing: 4, textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#2f6df0", display: "flex" }} />
            Available for new projects
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 56, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
            <span style={{ color: "#f4f8fa" }}>Websites and workflows,</span>
            <span style={{ backgroundImage: GOLD, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
              custom-made for your projects.
            </span>
          </div>

          <div style={{ display: "flex", color: "#c2d0da", fontSize: 23, letterSpacing: -0.3 }}>
            Built by someone who ran the business first — then built the software it needed.
          </div>

          {/* Live chip — the Maine-data feature, matching the site panel */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(8,19,29,0.55)", fontFamily: "JetBrains Mono", fontSize: 16, color: "#aebecb", alignSelf: "flex-start" }}>
            <div style={{ width: 8, height: 8, borderRadius: 9999, background: "#2f6df0", display: "flex" }} />
            <span style={{ color: "#9db8f5" }}>LIVE</span>
            <span>Portland, ME · weather · tide · Maine daylight</span>
          </div>

          <div style={{ display: "flex", marginTop: 2, color: "#8497a8", fontSize: 22, fontFamily: "JetBrains Mono", letterSpacing: 1 }}>
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

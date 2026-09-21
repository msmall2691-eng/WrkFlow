import { ImageResponse } from "next/og";

// Apple touch icon — same faceted gradient "M" badge as the favicon and
// nav mark: a duotone-shadowed, teal-to-gold gradient glyph on a harbor-navy
// gradient ground, with a beacon-dot accent. iOS applies its own corner mask.
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
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #0f2130 0%, #16293a 55%, #123a35 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.22), transparent 58%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: 110,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            color: "#d9a441",
            opacity: 0.55,
            transform: "translate(6px, 6px)",
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            backgroundImage: "linear-gradient(135deg, #7fe9dc 0%, #2dd4bf 45%, #d9a441 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          M
        </div>
        <div
          style={{
            position: "absolute",
            top: 22,
            right: 24,
            display: "flex",
            width: 13,
            height: 13,
            borderRadius: 9999,
            background: "#d9a441",
            boxShadow: "0 0 9px 2px rgba(217,164,65,0.75)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

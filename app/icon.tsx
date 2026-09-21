import { ImageResponse } from "next/og";

// Favicon — M Studio mark: faceted gradient "M" badge (teal → gold) on a
// harbor-navy gradient ground, with a beacon-dot accent. See Logo.tsx for
// the same mark rendered in the nav.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
          background: "linear-gradient(135deg, #0f2130 0%, #16293a 55%, #123a35 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            borderRadius: 7,
            background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.24), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            color: "#d9a441",
            opacity: 0.55,
            transform: "translate(1.5px, 1.5px)",
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
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
            top: 1,
            right: 1,
            display: "flex",
            width: 5,
            height: 5,
            borderRadius: 9999,
            background: "#d9a441",
            boxShadow: "0 0 4px 1px rgba(217,164,65,0.8)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

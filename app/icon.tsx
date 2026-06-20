import { ImageResponse } from "next/og";

// Favicon — M Studio mark: teal "M" on harbor navy.
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
          background: "#0b1722",
          color: "#2bb3a3",
          fontSize: 24,
          fontWeight: 800,
          fontFamily: "Arial, sans-serif",
          borderRadius: 7,
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}

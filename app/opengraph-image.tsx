import { ImageResponse } from "next/og";
import { foundingOffer } from "@/lib/content";

export const runtime = "edge";
export const alt = "M Studio — websites and web apps for small businesses";
// Rendered at 2× (2400×1260) so it stays crisp on hi-res desktop feeds.
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

/*
  The social card, in Daylight.

  It was a near-black card for a site that now ships light, so a shared link
  never looked like the page it opened. These are the light theme's own tokens
  from globals.css — cream ground, harbor navy ink, Harbor blue signal,
  terracotta warm accent — so the card and the page are the same object.

  Two other things changed with it:

  - The headline now matches the site's actual H1. It used to read "Websites
    and workflows, custom-made for your projects", which is not a sentence
    that appears anywhere on the site.
  - The old live-data panel listed "daylight → theme". That stopped being true
    when the site committed to Daylight; the sun drives the accent now. Rather
    than correct four tiny rows that are illegible at feed size anyway, the
    panel is one line, and the space it freed went to the price — the single
    most useful thing a stranger can learn from a thumbnail.
*/

/* Light-theme tokens, copied from app/globals.css :root[data-theme="light"]. */
const BASE = "#f7f4ef";
const INK = "#0b1722";
const MUTED = "#4a5563";
const FAINT = "#5a6572";
const SIGNAL = "#2f6df0";
const TERRACOTTA = "#d0764f";

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
          background: BASE,
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Tech grid — navy at a whisper. On cream this has to be far fainter
            than the white version was on navy, or it reads as graph paper. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(11,23,34,0.035) 2px, transparent 2px), linear-gradient(90deg, rgba(11,23,34,0.035) 2px, transparent 2px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Daylight wash — the warm paper gradient the hero uses, plus a cool
            pool on the right where the wordmark sits. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(60% 78% at 84% 72%, rgba(47,109,240,0.14), transparent 62%), radial-gradient(48% 60% at 88% 6%, rgba(208,118,79,0.10), transparent 62%), radial-gradient(56% 66% at 4% 22%, rgba(47,109,240,0.07), transparent 70%)",
          }}
        />

        {/* Ghost M STUDIO — navy at the same alpha the site's watermark uses. */}
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
            color: INK,
            opacity: 0.11,
          }}
        >
          <div style={{ display: "flex", fontSize: 500, fontWeight: 700, lineHeight: 0.8, letterSpacing: -16 }}>M</div>
          <div style={{ display: "flex", fontSize: 148, fontWeight: 700, letterSpacing: 4 }}>STUDIO</div>
        </div>

        {/* Scrim — cream over the wordmark so the headline stays crisp. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(105deg, rgba(247,244,239,0.97) 0%, rgba(247,244,239,0.72) 54%, rgba(247,244,239,0) 86%)",
          }}
        />

        {/* Foreground */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 46,
            padding: 152,
            width: "72%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              color: SIGNAL,
              fontSize: 38,
              letterSpacing: 8,
              textTransform: "uppercase",
              fontFamily: "JetBrains Mono",
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 9999, background: SIGNAL, display: "flex" }} />
            Available for new projects
          </div>

          {/* The site's actual headline, with the same word picked out. */}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 700, lineHeight: 1.03, letterSpacing: -3 }}>
            <span style={{ display: "flex", color: INK }}>We build websites and</span>
            <span style={{ display: "flex" }}>
              <span style={{ color: TERRACOTTA }}>web apps</span>
              <span style={{ color: INK }}>&nbsp;for small</span>
            </span>
            <span style={{ display: "flex", color: INK }}>businesses.</span>
          </div>

          <div style={{ display: "flex", color: MUTED, fontSize: 44, letterSpacing: -0.6 }}>
            Built by someone who ran a service company for ten years first.
          </div>

          {/* The price, and the one live-data line that is still true. */}
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 6, fontFamily: "JetBrains Mono" }}>
            <div
              style={{
                display: "flex",
                padding: "20px 34px",
                borderRadius: 9999,
                background: SIGNAL,
                color: "#ffffff",
                fontSize: 36,
                letterSpacing: 1,
              }}
            >
              Sites from ${foundingOffer.price}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, color: FAINT, fontSize: 32 }}>
              <div style={{ width: 14, height: 14, borderRadius: 9999, background: SIGNAL, display: "flex" }} />
              Live Portland, Maine data colours this page
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 2, color: FAINT, fontSize: 42, fontFamily: "JetBrains Mono", letterSpacing: 2 }}>
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

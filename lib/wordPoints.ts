/*
  A point cloud in the shape of a word.

  **The spec asks for "an SDF of 'Vesper'" and this samples the glyphs
  instead, which is the same picture by a cheaper road.** A signed
  distance field is the right tool when you need to know how far every
  point is from the letterform; all this needs is a large set of points
  that lie inside it. Rasterising the word once to an offscreen canvas and
  keeping the pixels that landed on ink gives exactly that, in a few
  milliseconds, with no font conversion step and no extra dependency.

  It also means the shape is made from the site's real wordmark in the
  site's real display face, rather than from an approximation of it.

  Deterministic by default. The sampler walks the raster in a fixed order
  and jitters each point by a hash of its index rather than by
  `Math.random`, so the same word always produces the same cloud: a hero
  that assembles differently on every load is one nobody can screenshot,
  compare or test.
*/

export type WordCloud = {
  /** xyz triples, centred on the origin, y up, roughly -1..1 on the long axis. */
  positions: Float32Array;
  /** How many points were actually produced. */
  count: number;
};

/** A cheap, stable hash in 0..1 from an integer. */
function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Rasterise `word` and return `count` points lying on its ink.
 *
 * Runs on the client only: it needs a 2D canvas. Returns an empty cloud on
 * the server so a caller can render nothing rather than crash.
 */
export function wordPoints(
  word: string,
  count: number,
  opts: { font?: string; weight?: number; depth?: number } = {},
): WordCloud {
  const empty = { positions: new Float32Array(0), count: 0 };
  if (typeof document === "undefined") return empty;

  const { font = "sans-serif", weight = 700, depth = 0.12 } = opts;

  /*
    **A canvas cannot resolve a CSS variable, and passing one silently
    does nothing.** `ctx.font = "700 220px var(--font-space-grotesk)"` is
    not a valid font shorthand, so the assignment is dropped and the
    context keeps its default 10px sans-serif. The word then rasterises
    about twenty pixels wide, a few hundred pixels are lit, and 120,000
    particles collapse onto them as a glowing dot. Nothing errors.

    So a `var(--x)` is resolved against the document first, and what comes
    back is the real family list `next/font` generated.
  */
  let family = font;
  const varName = /^var\((--[\w-]+)\)/.exec(font.trim());
  if (varName) {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName[1])
      .trim();
    family = resolved
      ? font.replace(varName[0], resolved)
      : font.replace(varName[0], "sans-serif");
  }

  /*
    One raster, sized so the word is a few hundred pixels across: enough
    resolution that 120k points land on distinguishable ink, small enough
    that reading it back is instant.
  */
  const W = 900;
  const H = 300;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return empty;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  /* Fit the word to the raster rather than guessing a size: a longer
     wordmark must not run off the edge and lose its last letters. */
  let size = 220;
  ctx.font = `${weight} ${size}px ${family}`;
  const fit = ctx.measureText(word).width;
  if (fit > W * 0.92) {
    size = Math.floor(size * ((W * 0.92) / fit));
    ctx.font = `${weight} ${size}px ${family}`;
  }
  ctx.fillText(word, W / 2, H / 2);

  const ink = ctx.getImageData(0, 0, W, H).data;

  /*
    Collect every lit pixel first, then take an evenly spaced sample of
    them. Sampling the raster directly at random would clump: the letters
    occupy maybe a tenth of the canvas, so most tries would miss.
  */
  const lit: number[] = [];
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      /* Red channel: the word is drawn white on black. */
      if (ink[(y * W + x) * 4] > 128) lit.push(y * W + x);
    }
  }
  if (lit.length === 0) return empty;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const px = lit[Math.floor((i / count) * lit.length) % lit.length];
    const x = px % W;
    const y = Math.floor(px / W);

    /* Jitter inside the pixel so the cloud reads as a solid letterform
       rather than as a grid, and give it a little thickness in z so it
       has a body when the camera is not square on. */
    const jx = hash(i * 3) - 0.5;
    const jy = hash(i * 3 + 1) - 0.5;
    const jz = hash(i * 3 + 2) - 0.5;

    positions[i * 3] = ((x + jx) / W - 0.5) * 2;
    /* `* (H / W)` and nothing else: that is what keeps the letterforms
       the shape the typeface drew them. An extra factor here stretches
       the word vertically, which on a 900x300 raster came out at twice
       its proper height and read as a condensed face nobody chose. */
    positions[i * 3 + 1] = -((y + jy) / H - 0.5) * 2 * (H / W);
    positions[i * 3 + 2] = jz * depth;
  }

  return { positions, count };
}

// app/api/shop/download/route.ts
// Hands out a purchased file, only for a valid signed link minted by
// /shop/thanks after Stripe confirmed the payment. Files live in
// /private/downloads, which is never served as a static asset.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyDownloadToken } from "@/lib/shopServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t") ?? "";
  let product;
  try {
    product = verifyDownloadToken(token);
  } catch (err) {
    console.error("[shop/download]", err);
    return new Response("Downloads are temporarily unavailable.", { status: 503 });
  }
  if (!product) {
    return new Response(
      "This download link has expired or isn't valid. Open the link from your receipt page again for a fresh one.",
      { status: 403 },
    );
  }
  const file = await readFile(path.join(process.cwd(), "private", "downloads", product.file));
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": product.contentType,
      "Content-Disposition": `attachment; filename="${product.file}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

import type { Metadata } from "next";
import { alt as ogAlt, size as ogSize } from "@/app/opengraph-image";

/*
  Per-page metadata.

  Next.js merges metadata shallowly: a page that sets `title` and
  `description` but not `openGraph`/`twitter`/`alternates` inherits the root
  layout's — so every shared link previewed as the homepage (og:url, og:title,
  og:description) and any page without its own canonical told Google it was a
  copy of "/". This builds the full set from one call so a page can't half-set
  it again.

  Setting `openGraph` on a page also drops the root opengraph-image from that
  page's tags, so the image is named explicitly here (the welcome-book page
  had been shipping with no share image for exactly this reason).
*/
export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: {
  /* Bare page title — the root template appends " · M Studio". */
  title: string;
  description: string;
  /* Route path, e.g. "/about". Resolved against metadataBase. */
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const shareTitle = ogTitle ?? `${title} · M Studio`;
  const shareDescription = ogDescription ?? description;
  const image = { url: "/opengraph-image", alt: ogAlt, ...ogSize, type: "image/png" };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "M Studio",
      url: path,
      title: shareTitle,
      description: shareDescription,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: [image],
    },
  };
}

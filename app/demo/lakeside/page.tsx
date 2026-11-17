import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import LakesideDemo from "@/components/demo/LakesideDemo";

/*
  /demo/lakeside: the first cinematic website demo. A lake at dawn, drawn
  live in a shader, where scrolling lifts the fog. Like the other demos it
  wears its own look rather than the studio's, says up front that the
  business is invented, books nothing, and is noindex.
*/

export const metadata: Metadata = {
  ...pageMeta({
    title: "Mistwood Cove — cinematic website demo",
    description:
      "A cinematic website demo built by M Studio: a Maine lake at dawn drawn live in code, where scrolling lifts the fog. A fictional rental, with nothing booked.",
    path: "/demo/lakeside",
  }),
  robots: { index: false, follow: false },
};

export default function LakesideDemoPage() {
  return <LakesideDemo />;
}

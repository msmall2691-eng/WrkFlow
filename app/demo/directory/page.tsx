import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import DirectoryDemo from "@/components/demo/DirectoryDemo";
import { directory } from "@/lib/demo-directory";

/*
  /demo/directory — a searchable directory, built rather than mocked up.

  Third demo, third KIND of thing. /demo/shop is a catalog with a cart,
  /demo/studio reasons about time, and this one is about finding the right
  entry among many: type, narrow, and get a count that moves. "Find a
  grower", "find a contractor who works Saturdays", "find a provider in my
  town" are all this page with the nouns changed.

  Two decisions worth keeping:

  1. The filters COMBINE, and that is the feature. Text, category, day and
     town all narrow the same set at once. When nothing matches, the page
     names every single filter that would bring results back, with how many
     each would find, rather than naming one and sounding certain about it.

  2. No photography. Every grower gets a drawn plot mark, so nothing
     pretends to be a picture of a farm that does not exist.

  The towns are real places and the growers are not, which is exactly why
  the banner says so first thing in the DOM.
*/

export const metadata: Metadata = {
  ...pageMeta({
    title: `${directory.name} — demo directory`,
    description:
      "A working directory demo built by M Studio: search and filter by what they grow, the day they are out, and the town. Every grower listed is invented.",
    path: "/demo/directory",
  }),
  robots: { index: false, follow: false },
};

export default function DirectoryDemoPage() {
  return <DirectoryDemo />;
}

import type { Metadata } from "next";

/*
  /lab is a WebGL shader experiment, not a sales page — but it was public and
  indexable, and because it is a client component it exports no metadata of
  its own, so the canonical fell back to "/" and told Google it was a copy of
  the homepage. A layout can carry metadata where the page cannot.
*/
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

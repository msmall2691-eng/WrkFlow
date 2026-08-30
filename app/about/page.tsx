import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import FounderNote from "@/components/FounderNote";

/*
  /about — the full founder story, moved off the homepage per Meg's call
  ("less words, more boxes"). The homepage keeps a compact OperatorBand
  with a "Meet the operator →" link here; anyone who wants the narrative
  gets it on its own page instead of scrolling past it.
*/

export const metadata: Metadata = {
  // No "| M Studio" here — the root layout's title template appends the
  // brand already; doubling it renders "… | M Studio · M Studio".
  title: "About — Built by an Operator",
  description:
    "M Studio is run by an operator who rebuilt the systems behind a real service business — and now builds them for others.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <FounderNote />
      </main>
      <Footer />
      <AccentSwitcher />
    </>
  );
}

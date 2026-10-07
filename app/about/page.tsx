import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import FounderNote from "@/components/FounderNote";
import Approach from "@/components/Approach";
import Stack from "@/components/Stack";
import CommandPalette from "@/components/CommandPalette";

/*
  /about — the person, the process, the toolkit.

  The founder story moved here first ("less words, more boxes"). Approach and
  Stack have now joined it for the same reason: on the homepage they were two
  more things between a visitor and the price, and both are things you go
  looking for rather than things that should stop you. Read in order this page
  answers who, how, and with what.
*/

export const metadata: Metadata = {
  // No "| M Studio" here — the root layout's title template appends the
  // brand already; doubling it renders "… | M Studio · M Studio".
  title: "About — Meet Meg",
  description:
    "Meet Meg, founder of M Studio. I build custom websites, business software and integrations, drawing on ten years of running The Maine Cleaning Company.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <FounderNote />
        <Approach />
        <Stack />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}


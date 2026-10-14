import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
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

export const metadata: Metadata = pageMeta({
  // No "| M Studio" here — the root layout's title template appends the
  // brand already; doubling it renders "… | M Studio · M Studio".
  title: "About — Meet Meg",
  description:
    "Meet Meg, founder of M Studio. Websites, CRMs, platform setup, data migration and integrations, built from hands-on business experience and a love of figuring out systems.",
  path: "/about",
});

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


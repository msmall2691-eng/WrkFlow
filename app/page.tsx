import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import Deployments from "@/components/Deployments";
import TryIt from "@/components/TryIt";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Homepage.

  The order is the whole argument: show the work, prove it exists, let them
  use something, then explain, then price, then ask.

    Hero       headline + real shipped screens, cycling
    Proof      the operating numbers, attributed
    Work       three case studies, each opening /work/[slug]
    Try it     a working quote calculator, not a description of one
    Services   three wide rows, each led by a screenshot
    Pricing    custom build + care plan (FAQ sits inside it)
    Contact    the form, and a real calendar link

  It was Hero → Services → Work → Pricing → Contact, which meant a visitor
  read two screens of claims before seeing a single thing that had been
  built. Work moved above Services for that reason.

  Gone from this page, all of it floating chrome that competed with the
  content: the "Daylight" theme pill that sat on top of cards on a phone, the
  fixed left-hand dot rail, and the scroll-progress bar that re-rendered on
  every scroll event. The command palette stays (⌘K still works, and it now
  carries the theme toggle the pill used to own); only its button is gone.
*/
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofStrip />
        <Deployments />
        <TryIt />
        <Services />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}

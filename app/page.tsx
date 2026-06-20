import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Shift from "@/components/Shift";
import WhoFor from "@/components/WhoFor";
import Deployments from "@/components/Deployments";
import CalculatorKit from "@/components/CalculatorKit";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import FounderNote from "@/components/FounderNote";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shift />
        <WhoFor />
        <Deployments />
        <CalculatorKit />
        <Services />
        <Approach />
        <FounderNote />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}

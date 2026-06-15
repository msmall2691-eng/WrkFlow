import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Shift from "@/components/Shift";
import WhoFor from "@/components/WhoFor";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import FounderNote from "@/components/FounderNote";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shift />
        <WhoFor />
        <Services />
        <Approach />
        <FounderNote />
        <Work />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
    </>
  );
}

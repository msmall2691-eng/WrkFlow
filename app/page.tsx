import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Shift from "@/components/Shift";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shift />
        <Services />
        <Approach />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

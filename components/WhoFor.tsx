import { whoIsItFor } from "@/lib/content";
import Reveal from "./Reveal";

export default function WhoFor() {
  return (
    <section id="whofor" className="relative border-t border-line py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="marker mb-6">// Who this is for</p>
        </Reveal>
        <Reveal delay={80}>
          <p className="display max-w-4xl text-2xl leading-snug text-ink sm:text-3xl md:text-4xl">
            {whoIsItFor}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import InstantQuoteDemo from "@/components/demo/InstantQuoteDemo";

/* Portfolio exhibit with an invented business: noindex, like the other demos. */
export const metadata: Metadata = {
  ...pageMeta({
    title: "Instant quote add-on · demo",
    description: "A working demo of the instant quote add-on on a sample contractor site, with live pricing settings. Invented business.",
    path: "/demo/instant-quote",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <InstantQuoteDemo />;
}

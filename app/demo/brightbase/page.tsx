import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import BrightBaseDemo from "@/components/demo/BrightBaseDemo";

/* Portfolio exhibit with an invented business: noindex, like the other demos. */
export const metadata: Metadata = {
  ...pageMeta({
    title: "BrightBase · demo",
    description: "A working demo of BrightBase: a job from request to quote to schedule to invoice to paid. Invented company and sample data.",
    path: "/demo/brightbase",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BrightBaseDemo />;
}

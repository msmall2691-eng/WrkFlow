import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import FamilyPortalDemo from "@/components/demo/FamilyPortalDemo";

/* Portfolio exhibit with an invented business: noindex, like the other demos. */
export const metadata: Metadata = {
  ...pageMeta({
    title: "Family portal · demo",
    description: "A working demo of a childcare family portal: door kiosk check-in and the parent's view of the day. Invented program and families.",
    path: "/demo/family-portal",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FamilyPortalDemo />;
}

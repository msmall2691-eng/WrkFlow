import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import TurnoverSyncDemo from "@/components/demo/TurnoverSyncDemo";

/* Portfolio exhibit with an invented business: noindex, like the other demos. */
export const metadata: Metadata = {
  ...pageMeta({
    title: "Turnover Sync · demo",
    description: "A working demo of Turnover Sync: rental bookings from Airbnb and Vrbo become a cleaning schedule. Invented host and sample bookings.",
    path: "/demo/turnover-sync",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TurnoverSyncDemo />;
}

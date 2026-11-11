import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import ShopDemo from "@/components/demo/ShopDemo";
import { shop } from "@/lib/demo-shop";

/*
  /demo/shop — an e-commerce demo, built rather than mocked up.

  Meg can point at real client sites for cleaning, admin services,
  construction and a rental welcome book, but nothing she had showed that
  she can build a store. This is that gap, filled with something clickable.

  Three decisions worth keeping:

  1. It does NOT wear the studio's chrome. No PanelHeader, no Footer, no
     `.cp`. The whole point is to look like a different company's site,
     which is what a prospective client is trying to picture. /intake set
     the precedent for a route that opts out of the site around it, and the
     root layout carries no nav of its own, so this costs nothing.

  2. It is a print shop because the product can be drawn. Every other kind
     of store needs product photography the studio does not own, and
     CLAUDE.md bans invented proof "anywhere, including demos and
     placeholders". Here the artwork IS the product, rendered as SVG in
     components/demo/PrintArtwork.tsx, so nothing on the page pretends to
     be a photograph of stock that does not exist.

  3. It takes no payment and says so twice, before the Checkout button and
     again after it. A demo that mocks up a card field is one careless
     visitor away from a real card number in a form that goes nowhere.

  `robots: noindex` because this is a portfolio exhibit, not a shop that
  should turn up in search for anybody looking to buy a print. It is also
  the reason the fictional brand can stay fictional without competing for
  its own name.
*/

export const metadata: Metadata = {
  ...pageMeta({
    title: `${shop.name} — demo store`,
    description:
      "A working e-commerce demo built by M Studio: browse, pick a size, and fill a cart. A fictional shop, with no real stock and no payment.",
    path: "/demo/shop",
  }),
  robots: { index: false, follow: false },
};

export default function ShopDemoPage() {
  return <ShopDemo />;
}

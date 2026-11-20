import { catalog, type CatalogItem } from "./catalog";

/*
  The tiles on the work canvas.

  **Derived from `catalog`, never written by hand, and that is the whole
  reason this hero is allowed to exist.** Meg asked for the dark cinematic
  look of the portfolio templates she sent; the thing those templates all
  have and this project does not is a stock of beautiful invented imagery.
  What it has instead is 42 real captures of real systems, every one
  already attributed in `catalog` with a name, a status, a price and a
  place to go.

  So the canvas is not a mood board behind the page. It is the shop, laid
  out as one, which answers Meg's original complaint about the site in her
  own words: "hard to see what is for sale that's tangible". Every tile is
  a real screenshot of a real thing, and clicking it goes to that thing.

  `catalog` says an image is "a real capture. Required for everything
  except workbench", and `workbench` items are not built at all, so
  filtering on the image is also filtering out everything unbuilt. A tile
  for something that does not exist would be the invented proof this
  repo's first rule refuses, drawn rather than written.
*/

export type CanvasTile = {
  id: string;
  /** A real capture of a real system. */
  image: string;
  /** What it is, from the catalog. */
  name: string;
  /** Free, Ready to buy, Built and running. */
  status: CatalogItem["status"];
  /** The price already decided for it. */
  price: string;
  /** Where clicking it goes, if anywhere. */
  href?: string;
  /** True for a portrait phone capture, which must not be cropped. */
  contain: boolean;
};

export const canvasTiles: CanvasTile[] = catalog
  .filter((c): c is CatalogItem & { image: string } => Boolean(c.image))
  .map((c) => ({
    id: c.id,
    image: c.image,
    name: c.name,
    status: c.status,
    price: c.price,
    /* The primary action if there is one, else the proof. An external
       proof link is still a real destination, so it counts. */
    href: c.primary?.href ?? c.proof?.href,
    contain: c.fit === "contain",
  }));

/*
  The canvas tiles the same list over and over to fill the screen, so a
  short list reads as a repeating pattern rather than as a wall. Checked
  rather than assumed: with fewer than this the repeat is obvious at
  1440px, and the hero stops looking like an archive and starts looking
  like a slideshow with a bug.
*/
export const MIN_TILES_FOR_A_WALL = 12;

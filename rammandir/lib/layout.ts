import mobile from "@/data/mobile.json";
import mobileWide from "@/data/mobile-wide.json";
import tablet from "@/data/tablet.json";
import tabletWide from "@/data/tablet-wide.json";
import laptop from "@/data/laptop.json";
import desktop from "@/data/desktop.json";

export type TextItem = {
  tx: string;
  ff: string;
  fs: number;
  lh: string;
  c: string;
  ls?: string;
  ta?: string;
};

export type LayerType = "i" | "t" | "c" | "b" | "card";

/** One measured layer. Coordinates are design px on the artboard; y is page-absolute. */
export type Layer = {
  id: string;
  t: LayerType;
  n: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  r?: number;
  k?: number;
  src?: string;
  fit?: string;
  bg?: string;
  wrap?: boolean;
  items?: TextItem[];
};

export type SectionData = {
  id: string;
  name: string;
  z: number;
  top: number;
  height: number;
  clip: boolean;
  bg?: string | null;
  elements: Layer[];
};

export type ArtboardId = "mobile" | "mobile-wide" | "tablet" | "tablet-wide" | "laptop" | "desktop";
/** Which family of Framer components the artboard uses (mobile-style vs desktop-style blocks). */
export type Style = "mobile" | "desktop";
export type CardKind = "small" | "tablet" | "desktop";

export type GalleryGeometry = { width: number; height: number; view: number; wheel: number; wheelTop: number; card: number };

export type ArtboardData = {
  id: ArtboardId;
  style: Style;
  card: CardKind;
  width: number;
  height: number;
  refViewport: number;
  minViewport: number;
  maxViewport: number;
  gallery: GalleryGeometry;
  sections: SectionData[];
};

/**
 * Framer serves a separate fixed-width artboard per breakpoint. These were each measured
 * on the live site at the viewport noted in data/raw/*.json.
 */
export const artboards: ArtboardData[] = [mobile, mobileWide, tablet, tabletWide, laptop, desktop] as unknown as ArtboardData[];

/**
 * Returns the artboard for a viewport width and the scale to draw it at.
 *  - below 430px Framer's mobile layout is fluid, so the 393 design scales with the viewport;
 *  - between 430 and 1558px each artboard is a fixed width, centred (and cropped if wider);
 *  - from 1559px Framer's widest layouts grow with the window, approximated by scaling.
 */
export function pickArtboard(viewportWidth: number): { artboard: ArtboardData; u: number } {
  const w = Math.max(320, viewportWidth);
  const artboard = artboards.find((a) => w >= a.minViewport && w <= a.maxViewport) ?? artboards[artboards.length - 1];
  let u = 1;
  if (artboard.id === "mobile") u = w / artboard.refViewport;
  if (artboard.id === "desktop" && w >= 1559) u = (w - 41) / artboard.width;
  return { artboard, u };
}

/**
 * Asset locations. By default images and fonts load from the Framer CDN the
 * original site uses. Run `npm run assets` to copy them into /public and set
 * NEXT_PUBLIC_LOCAL_ASSETS=1 to serve them from your own deployment instead.
 */
const LOCAL = process.env.NEXT_PUBLIC_LOCAL_ASSETS === "1";
const CDN = "https://framerusercontent.com";

export const img = (file: string) => (LOCAL ? `/images/${file}` : `${CDN}/images/${file}`);
export const font = (hash: string) => (LOCAL ? `/fonts/${hash}.woff2` : `${CDN}/assets/${hash}.woff2`);

/** The flag drawn by the waving-flag canvas. */
export const FLAG_IMAGE = "Mr5CWcNPJMlbL9TvpxtjbiK8yo.png";

/** Fonts uploaded to the Framer project, keyed by the family name the layout data uses. */
export const FONTS: Record<string, { hash: string; weight: number }> = {
  "Gotham Book": { hash: "4y04scLej0VIDnfiTUaHmR9kJ8", weight: 325 },
  "Gotham Light": { hash: "tDHgE1HIlQZDKKTmmqw6GznA8AA", weight: 300 },
  "Gotham Medium": { hash: "s9K7gd62GoiEFlvMdmFDczcSwA", weight: 350 },
  "IvyOra Display Regular": { hash: "SEQP8hnAhgJcZlHjxip9s3uuKg", weight: 400 },
  "IvyOra Display Medium": { hash: "4Jgqn7NsDO77QsxaQyfnM0ICLY4", weight: 500 },
  "IvyOra Display Bold": { hash: "VBd98BPo7gIkQI9U4PQ8dyWGdw", weight: 700 },
  "Miofarin Regular": { hash: "BMjg1YByjbhOVDynKUorFYRCk", weight: 400 },
  "Brother Signature Regular": { hash: "WWjETWwBUpECorvxciFxrUEZg", weight: 400 },
};

export function fontFaceCss() {
  return Object.entries(FONTS)
    .map(([family, f]) => `@font-face{font-family:"${family}";src:url(${font(f.hash)}) format("woff2");font-weight:${f.weight};font-display:swap}`)
    .join("\n");
}

#!/usr/bin/env node
/**
 * Copies every image and font the site uses from the Framer CDN into /public,
 * so the site can be served without depending on framerusercontent.com.
 *
 *   npm run assets
 *   NEXT_PUBLIC_LOCAL_ASSETS=1 npm run build
 *
 * Writes public/asset-manifest.json listing each file, its source URL and size.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CDN = "https://framerusercontent.com";

const images = new Set();
for (const ab of ["mobile", "mobile-wide", "tablet", "tablet-wide", "laptop", "desktop"]) {
  const data = JSON.parse(await readFile(path.join(root, "data", `${ab}.json`), "utf8"));
  for (const s of data.sections) for (const e of s.elements) if (e.src) images.add(e.src);
}
// Referenced from code rather than layout data.
const config = await readFile(path.join(root, "lib", "config.ts"), "utf8");
for (const m of config.matchAll(/icon: "([^"]+)"/g)) images.add(m[1]);
const assets = await readFile(path.join(root, "lib", "assets.ts"), "utf8");
for (const m of assets.matchAll(/"([A-Za-z0-9]+\.(?:png|webp|jpg))"/g)) images.add(m[1]);
const fonts = [...assets.matchAll(/hash: "([A-Za-z0-9]+)"/g)].map((m) => m[1]);

const jobs = [
  ...[...images].map((f) => ({ url: `${CDN}/images/${f}`, out: path.join(root, "public", "images", f) })),
  ...fonts.map((h) => ({ url: `${CDN}/assets/${h}.woff2`, out: path.join(root, "public", "fonts", `${h}.woff2`) })),
];

await mkdir(path.join(root, "public", "images"), { recursive: true });
await mkdir(path.join(root, "public", "fonts"), { recursive: true });

const manifest = [];
let failed = 0;
for (const j of jobs) {
  try {
    if (!existsSync(j.out)) {
      const res = await fetch(j.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(j.out, Buffer.from(await res.arrayBuffer()));
    }
    const { size } = await stat(j.out);
    manifest.push({ file: path.relative(path.join(root, "public"), j.out), source: j.url, bytes: size });
    process.stdout.write(".");
  } catch (err) {
    failed++;
    console.error(`\n✗ ${j.url}: ${err.message}`);
  }
}
await writeFile(path.join(root, "public", "asset-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} assets in /public (${failed} failed). Set NEXT_PUBLIC_LOCAL_ASSETS=1 to serve them locally.`);
if (failed) process.exit(1);

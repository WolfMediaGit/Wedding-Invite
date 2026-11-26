import { defineConfig } from "@playwright/test";

/**
 * Visual comparison against the live Framer site.
 *   npm run build && npm run start   (in another terminal)
 *   npm run test:visual
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3000" },
  reporter: [["list"], ["html", { open: "never" }]],
});

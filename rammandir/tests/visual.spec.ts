import { test, expect, type Page } from "@playwright/test";

const REFERENCE = "https://rammandir.framer.website/";
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
];

/** Freeze both pages at their settled state: no smooth scroll, no running animations. */
async function settle(page: Page) {
  await page.addStyleTag({
    content: "*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}",
  });
  // Scroll through once so in-view animations fire, then return to the top.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(3500);
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.width}×${vp.height}`, () => {
    test.use({ viewport: vp });

    test("page height and sections match the reference", async ({ page, browser }) => {
      const ref = await browser.newPage({ viewport: vp });
      await ref.goto(REFERENCE, { waitUntil: "networkidle" });
      const refInfo = await ref.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        sections: [...document.querySelectorAll("[data-framer-name]")]
          .filter((e) => /^\d —/.test(e.getAttribute("data-framer-name") ?? "") && e.getClientRects().length)
          .map((e) => Math.round(e.getBoundingClientRect().top + scrollY))
          .sort((a, b) => a - b),
      }));
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForSelector("[data-artboard]");
      const ours = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        sections: [...document.querySelectorAll("section")].map((s) => Math.round(s.getBoundingClientRect().top + scrollY)).sort((a, b) => a - b),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }));
      expect(ours.overflow).toBe(false);
      expect(Math.abs(ours.height - refInfo.height) / refInfo.height).toBeLessThan(0.06);
      ours.sections.forEach((top, i) => expect(Math.abs(top - refInfo.sections[i])).toBeLessThan(refInfo.height * 0.06));
      await ref.close();
    });

    test("screenshots side by side", async ({ page, browser }, info) => {
      const ref = await browser.newPage({ viewport: vp });
      await ref.goto(REFERENCE, { waitUntil: "networkidle" });
      await settle(ref);
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForSelector("[data-artboard]");
      await settle(page);
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0, n = 0; y < h; y += vp.height, n++) {
        for (const [label, p] of [["reference", ref], ["clone", page]] as const) {
          await p.evaluate((v) => window.scrollTo(0, v), y);
          await p.waitForTimeout(400);
          await info.attach(`${String(n).padStart(2, "0")}-${label}`, { body: await p.screenshot(), contentType: "image/png" });
        }
      }
      await ref.close();
    });

    test("no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      expect(errors).toEqual([]);
    });
  });
}

test.describe("interactions", () => {
  test.use({ viewport: { width: 393, height: 852 } });

  test("RSVP builds the WhatsApp link", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form[aria-label='RSVP via WhatsApp']");
    const send = form.getByText("Send via WhatsApp");
    await expect(send).toHaveAttribute("aria-disabled", "true");
    await form.getByPlaceholder("Full Name").fill("Test Guest");
    await form.getByRole("button", { name: /Select Event/ }).click();
    await form.getByRole("option", { name: "Mehendi" }).click();
    await form.getByRole("option", { name: "Sangeet" }).click();
    await form.locator("select").selectOption("3");
    await expect(send).toHaveAttribute(
      "href",
      "https://wa.me/919819200906?text=Hi!%20I'd%20like%20to%20RSVP.%0AName%3A%20Test%20Guest%0AEvent(s)%3A%20Mehendi%2C%20Sangeet%0ANumber%20of%20People%3A%203",
    );
  });

  test("map links and venue switcher work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Open in Google Maps/ })).toHaveAttribute("href", /19\.2183/);
    await page.getByRole("button", { name: "Location 2" }).click();
    await expect(page.getByRole("button", { name: "Location 2" })).toHaveAttribute("aria-pressed", "true");
  });

  test("countdown is live", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("timer")).toContainText("DAYS");
  });
});

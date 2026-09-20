import { test, expect } from "@playwright/test";

test("content images carry intrinsic dimensions", async ({ page }) => {
  await page.goto(
    "/2013/html5-css3-javascript-only-photobooth-with-image-download/",
  );
  const images = page.locator(".prose img");
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute("src");
    const width = Number(await img.getAttribute("width"));
    const height = Number(await img.getAttribute("height"));
    expect(width, `width on ${src}`).toBeGreaterThan(0);
    expect(height, `height on ${src}`).toBeGreaterThan(0);

    // The attributes are only worth anything if they match the file:
    // a wrong ratio reserves the wrong box and shifts worse than
    // stamping nothing would. Lazy images below the fold decode
    // late, so wait for the real bitmap before comparing.
    await img.scrollIntoViewIfNeeded();
    const natural = await img.evaluate(async (el: HTMLImageElement) => {
      if (!el.complete) {
        await el.decode().catch(() => {});
      }
      return { width: el.naturalWidth, height: el.naturalHeight };
    });
    expect(natural, `natural size of ${src}`).toEqual({ width, height });
  }
});

test("images inside code samples are left alone", async ({ page }) => {
  await page.goto(
    "/2013/html5-css3-javascript-only-photobooth-with-image-download/",
  );
  const code = await page.locator("pre").allTextContents();
  const samples = code.join("\n");
  expect(samples).toContain("<img");
  expect(samples).not.toMatch(/<img[^>]*\bwidth="\d+"/);
});

test("only the first content image loads eagerly", async ({ page }) => {
  await page.goto("/2019/didnt-launch-my-startup/");
  const loading = await page
    .locator(".prose img")
    .evaluateAll((els) => els.map((el) => el.getAttribute("loading")));
  expect(loading.length).toBeGreaterThan(1);
  expect(loading[0]).toBeNull();
  expect(loading.slice(1)).toEqual(loading.slice(1).map(() => "lazy"));
});

// A retina capture carries no density of its own, so the stamped size
// is the file divided by the suffix in its name. Both densities run
// because the divisor is read from the filename.
const RETINA = [
  { path: "/2022/one-tap-track-weight-daily-ios-no-app/", scale: 3 },
  { path: "/2018/host-site-github-pages-with-ssl/", scale: 2 },
];

for (const { path, scale } of RETINA) {
  test(`@${scale}x captures are stamped at the divided size`, async ({
    page,
  }) => {
    await page.goto(path);
    const images = page.locator(`.prose img[src*="@${scale}x."]`);
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      const width = Number(await img.getAttribute("width"));
      const height = Number(await img.getAttribute("height"));

      await img.scrollIntoViewIfNeeded();
      const natural = await img.evaluate(async (el: HTMLImageElement) => {
        if (!el.complete) {
          await el.decode().catch(() => {});
        }
        return { width: el.naturalWidth, height: el.naturalHeight };
      });

      // Repeating the plugin's own rounding, not multiplying back: an
      // odd file dimension divides to a half pixel, and host14@2x.png
      // and two others land there.
      expect(width, `width on ${src}`).toBe(Math.round(natural.width / scale));
      expect(height, `height on ${src}`).toBe(
        Math.round(natural.height / scale),
      );

      // A plugin that stopped dividing would still satisfy the rounding
      // above if the file were small enough to match; this cannot pass
      // unless the stamp is genuinely smaller than the file.
      expect(natural.width, `divided width on ${src}`).toBeGreaterThan(width);
    }
  });
}

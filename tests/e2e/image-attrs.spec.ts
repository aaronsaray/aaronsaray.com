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
      if (!el.complete) await el.decode().catch(() => {});
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

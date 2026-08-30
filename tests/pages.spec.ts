import { test, expect } from "@playwright/test";

// One case per route template. The 707 posts and 52 tags are not
// enumerated here: check-url-contract.mjs already proves every one of
// them resolves in dist/. These cases prove each template renders.
const PAGES = [
  { name: "home", path: "/" },
  { name: "contact", path: "/contact/" },
  { name: "cv", path: "/cv/" },
  { name: "books", path: "/books/" },
  { name: "who am i", path: "/who-am-i/" },
  { name: "blog index", path: "/blog/" },
  { name: "blog pagination", path: "/blog/page/2/" },
  { name: "tag index", path: "/tag/" },
  { name: "tag landing", path: "/tag/php/" },
  { name: "post", path: "/2007/ajax-security-research-and-findings-round-1/" },
];

for (const { name, path } of PAGES) {
  test(`${name} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("404 page renders", async ({ page }) => {
  const response = await page.goto("/no-such-page-exists/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
});

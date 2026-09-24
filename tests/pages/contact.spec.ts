import { test, expect } from "@playwright/test";

const ADDRESS = "aaron@aaronsaray.com";

test("the served HTML never carries the literal address", async ({
  request,
}) => {
  const html = await (await request.get("/contact/")).text();

  expect(html).not.toContain(ADDRESS);
  expect(html).not.toContain("mailto:");
  // "mailto:" as the entities contact.astro writes.
  expect(html).toContain("&#109;&#97;&#105;&#108;&#116;&#111;&#58;");
});

test("the link decodes to the address for a person", async ({ page }) => {
  await page.goto("/contact/");
  const link = page.locator('main a[href^="mailto:"]');

  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", `mailto:${ADDRESS}`);
  // innerText leaves out display: none content, as copying does.
  expect(await link.innerText()).toBe(ADDRESS);
  await expect(link).toHaveAccessibleName(ADDRESS);
});

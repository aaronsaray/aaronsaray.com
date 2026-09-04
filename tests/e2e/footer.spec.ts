import { test, expect } from "@playwright/test";

test("footer states the no-AI rule and links it to the colophon", async ({
  page,
}) => {
  await page.goto("/");

  const footer = page.locator("footer");
  await expect(footer).toContainText(
    "All words come from my human brain, not AI.",
  );

  const link = footer.getByRole("link", { name: "human brain, not AI" });
  await expect(link).toHaveAttribute("href", "/colophon/");
  await link.click();
  await expect(page).toHaveURL(/\/colophon\/$/);
  await expect(page.locator("h1")).toHaveCount(1);
});

// The copyright line is the one place a link sits inside running text
// with no color difference from its neighbors, so the resting
// underline is what satisfies WCAG 1.4.1 there. Asserted on the
// rendered value so a class cleanup cannot drop it.
test("copyright-line links are underlined at rest", async ({ page }) => {
  await page.goto("/");

  const links = page.locator("footer p:has(a[href='/colophon/']) a");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  }
});

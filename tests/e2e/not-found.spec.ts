import { test, expect } from "@playwright/test";

// The Enter handler and the RUN link's id are a matched pair: the
// script finds the link by id and clicks it.
test("Enter with nothing focused runs the link home", async ({ page }) => {
  await page.goto("/no-such-page-exists/");
  const run = page.locator("#run");
  await expect(run).toHaveAccessibleName(/RUN.*go back home/);
  await expect(run).toHaveAttribute("href", "/");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/");
});

// The skip link is the first tab stop on every page.
test("Enter on a focused control does not run the link", async ({ page }) => {
  await page.goto("/no-such-page-exists/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/no-such-page-exists\/#main$/);
});

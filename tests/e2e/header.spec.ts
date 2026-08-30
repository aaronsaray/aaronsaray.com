import { test, expect } from "@playwright/test";

// Header and nav ship on every page, so they are covered once here
// rather than repeated per page in pages.spec.ts.

test("nav dropdown opens on keyboard focus", async ({ page }) => {
  await page.goto("/");

  const panel = page.locator("#nav-menu-about");
  await expect(panel).toBeHidden();

  // The panel is CSS-only (group-focus-within); focusing the trigger
  // is what reveals it.
  await page.getByRole("button", { name: "About" }).focus();
  await expect(panel).toBeVisible();

  // Scoped to the panel: the footer links to the same pages.
  const firstItem = panel.getByRole("link", { name: "Who am I" });
  // visibility is a transitioned property here, so the links stay
  // unfocusable for the duration and Tab would skip straight past
  // them. Wait for the panel's own link to be reachable first.
  await expect(firstItem).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(firstItem).toBeFocused();
});

test("skip link is the first tab stop and moves reading position", async ({
  page,
}) => {
  await page.goto("/");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  // sr-only until focused.
  await expect(skip).toBeVisible();

  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);

  // <main> has no tabindex, so it never becomes activeElement. What
  // the link actually does is move the sequential focus start, so the
  // next Tab has to land inside <main> rather than back in the nav.
  await page.keyboard.press("Tab");
  await expect(page.locator("main :focus")).toHaveCount(1);
});

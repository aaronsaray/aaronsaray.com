import { test, expect } from "@playwright/test";

test("the keyboard opens, leaves, and closes a nav panel", async ({ page }) => {
  await page.goto("/");

  const button = page.getByRole("button", { name: "About" });
  const panel = page.locator("#nav-menu-about");
  await expect(panel).toBeHidden();

  await button.focus();
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(panel.getByRole("link", { name: "Who am I" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Writing" })).toBeFocused();
  await expect(panel).toBeHidden();
});

test("hovering a nav section opens its panel until the mouse leaves", async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, "a touch screen has no hover");
  await page.goto("/");

  const panel = page.locator("#nav-menu-about");
  await page.getByRole("button", { name: "About" }).hover();
  await expect(panel).toBeVisible();

  await page.locator("h1").hover();
  await expect(panel).toBeHidden();
});

test("a tap opens the nav dropdown and its links work", async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, "a touch screen has neither hover nor Tab");
  await page.goto("/");

  const panel = page.locator("#nav-menu-about");
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: "About" }).tap();
  await panel.getByRole("link", { name: "Who am I" }).tap();
  await expect(page).toHaveURL(/\/about\/$/);
});

test("skip link is the first tab stop and moves reading position", async ({
  page,
}) => {
  await page.goto("/");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);

  // <main> never becomes activeElement; the link moves the sequential
  // focus start, so the next Tab lands inside it.
  await page.keyboard.press("Tab");
  await expect(page.locator("main :focus")).toHaveCount(1);
});

const ACTIVE_SECTION = [
  { path: "/contact/", label: "Contact" },
  { path: "/blog/", label: "Writing" },
  { path: "/blog/page/2/", label: "Writing" },
  { path: "/books/", label: "Writing" },
  { path: "/tag/php/", label: "Writing" },
  {
    path: "/2007/ajax-security-research-and-findings-round-1/",
    label: "Writing",
  },
  { path: "/cv/", label: "About" },
  { path: "/about/", label: "About" },
];

for (const { path, label } of ACTIVE_SECTION) {
  test(`${path} marks ${label} as the active section`, async ({ page }) => {
    await page.goto(path);

    // The rendered border, not the class, so recoloring the rule passes.
    const lit = await page
      .locator("header nav a span, header nav button span")
      .evaluateAll((els) =>
        els
          .filter(
            (el) =>
              getComputedStyle(el).borderBottomColor !== "rgba(0, 0, 0, 0)",
          )
          .map((el) => el.textContent.trim()),
      );

    expect(lit).toEqual([label]);
  });
}

test("aria-current marks the page, not the section", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("header [aria-current]")).toHaveText("Contact");

  await page.goto("/blog/");
  const panel = page.locator("#nav-menu-writing");
  await page.getByRole("button", { name: "Writing" }).click();
  await expect(panel.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.goto("/2007/ajax-security-research-and-findings-round-1/");
  await expect(page.locator("header [aria-current]")).toHaveCount(0);
});

// axe passes a same-color link in running text (allowSameColor is on
// by default), so only this checks the underline WCAG 1.4.1 needs here.
test("copyright-line links are underlined at rest", async ({ page }) => {
  await page.goto("/");

  const links = page.locator("footer p:has(a[href='/colophon/']) a");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  }
});

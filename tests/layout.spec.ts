import { test, expect } from "@playwright/test";

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

// The panels are the only header path to four pages, and a touch
// screen has neither hover nor Tab: the tap's focus is what opens one.
test("a tap opens the nav dropdown and its links work", async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, "touch only");
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

  // <main> has no tabindex, so it never becomes activeElement. What
  // the link actually does is move the sequential focus start, so the
  // next Tab has to land inside <main> rather than back in the nav.
  await page.keyboard.press("Tab");
  await expect(page.locator("main :focus")).toHaveCount(1);
});

// Active state is derived from the pathname. A section lights when any
// child matches, and a post's path (/:year/:slug/) is the case that
// cannot be matched from the hrefs.
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

    // Asserted on the rendered border rather than the class name, so
    // retuning the rule's color does not break the test.
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
  await page.getByRole("button", { name: "Writing" }).focus();
  await expect(panel.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  // On a post the section is still Writing, but no nav link is the
  // current page.
  await page.goto("/2007/ajax-security-research-and-findings-round-1/");
  await expect(page.locator("header [aria-current]")).toHaveCount(0);
});

test("the footer's no-AI link goes to the colophon", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer a[href='/colophon/']").click();
  await expect(page).toHaveURL(/\/colophon\/$/);
});

// The copyright line is the one place a link sits inside running text
// with no color difference from its neighbors, so the resting
// underline is what satisfies WCAG 1.4.1 there. axe's link-in-text-block
// rule passes a same-color link (allowSameColor is on by default), so
// the sweep never sees this. Asserted on the rendered value so a class
// cleanup cannot drop it.
test("copyright-line links are underlined at rest", async ({ page }) => {
  await page.goto("/");

  const links = page.locator("footer p:has(a[href='/colophon/']) a");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  }
});

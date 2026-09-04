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

// The rule underlines the label only, so it hangs off an inner span in
// both the dropdown triggers and the plain links. Those two markups
// have to put it on one line or the nav looks misaligned as the active
// item moves between them.
test("the active rule sits at the same height on every nav item", async ({
  page,
}) => {
  await page.goto("/contact/");

  const bottoms = await page
    .locator("header nav a span, header nav button span")
    .evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().bottom)),
    );

  expect(bottoms.length).toBe(3);
  expect(new Set(bottoms).size).toBe(1);
});

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

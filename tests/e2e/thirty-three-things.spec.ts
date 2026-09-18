import { test, expect } from "@playwright/test";

const POST = "/2017/33-things-book/";

test.beforeEach(async ({ page }) => {
  await page.goto(POST);
});

test("the download panel sits above the prose", async ({ page }) => {
  const panel = page.locator(".thirty-three-things");
  await expect(panel).toBeVisible();

  // The panel is worth nothing below the wall of text it exists to
  // skip: a reader arriving from /books/ has to see it without
  // scrolling past the story.
  const panelBox = await panel.boundingBox();
  const proseBox = await page.locator(".prose").boundingBox();
  if (!panelBox || !proseBox) throw new Error("panel or prose has no box");
  expect(panelBox.y).toBeLessThan(proseBox.y);
});

test("both formats download the file the post promises", async ({
  page,
  request,
}) => {
  for (const name of ["Download PDF", "Download ePub"]) {
    const href = await page.getByRole("link", { name }).getAttribute("href");
    expect(href, `${name} href`).toBeTruthy();

    // The hrefs are written out in the component, so nothing but a
    // fetch proves they still name the files that ship.
    const res = await request.get(href!);
    expect(res.status(), `${name} -> ${href}`).toBe(200);
  }
});

test("the cover is decorative beside the named links", async ({ page }) => {
  // The two links name the book and its formats, so alt text on the
  // cover would only repeat them to a screen reader.
  await expect(page.locator(".thirty-three-things img")).toHaveAttribute(
    "alt",
    "",
  );
});

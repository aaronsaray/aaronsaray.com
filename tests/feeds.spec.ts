import { test, expect } from "@playwright/test";

// The feeds and sitemap are hand-rolled strings rather than generated
// by an integration, so nothing but these checks proves they stay
// well-formed.
const FEEDS = [
  { name: "blog feed", path: "/blog/index.xml" },
  { name: "tag index feed", path: "/tag/index.xml" },
  { name: "per-tag feed", path: "/tag/php/index.xml" },
  { name: "sitemap", path: "/sitemap.xml" },
];

for (const { name, path } of FEEDS) {
  test(`${name} is served as well-formed XML`, async ({ page, request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    // Node has no XML parser, so the blank page's is borrowed.
    const error = await page.evaluate(
      (xml) => {
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        return doc.querySelector("parsererror")?.textContent ?? null;
      },
      await response.text(),
    );
    expect(error).toBeNull();
  });
}

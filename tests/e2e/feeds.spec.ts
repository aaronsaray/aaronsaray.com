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
    // Routes vary between application/xml and application/rss+xml.
    expect(response.headers()["content-type"]).toContain("xml");
    const body = await response.text();

    // Parsed explicitly rather than by navigating to the URL: the dev
    // server hands these back as plain text, so the browser renders
    // them as an escaped document and never runs its XML parser.
    await page.goto("/");
    const error = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      return doc.querySelector("parsererror")?.textContent ?? null;
    }, body);
    expect(error).toBeNull();
  });
}

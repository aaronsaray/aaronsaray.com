// Prints index.html to front.pdf and back.pdf with Chromium. Run as: make card

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// MOO's bleed size. Chromium rounds the page box to whole points, so
// the PDF comes out at 264 x 156pt; the @page rule in index.html has
// the derivation.
const BLEED_IN = { width: 3.66, height: 2.16 };
const PAGE_PT = {
  width: Math.round(BLEED_IN.width * 72),
  height: Math.round(BLEED_IN.height * 72),
};

const SIDES = ["front", "back"] as const;

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

// Chromium stamps the render time into CreationDate and ModDate, and
// nothing else in the file varies between runs. A fixed stamp of the
// same byte length keeps the xref offsets valid and the committed PDF
// byte-stable until the design changes.
function stamp(pdf: Buffer): Buffer {
  let count = 0;
  const text = pdf
    .toString("latin1")
    .replace(/(\/(?:CreationDate|ModDate) \(D:)\d{14}/g, (_, key: string) => {
      count += 1;
      return `${key}20000101000000`;
    });
  if (count !== 2) {
    fail(`expected 2 date fields, found ${count}`);
  }
  return Buffer.from(text, "latin1");
}

// The PDF carries a plain xref table and one text /MediaBox per page,
// so the page count and size can be read without a parser. A second
// page means the copy overflowed; a Letter page means @page was lost.
function check(pdf: Buffer, side: string): void {
  const text = pdf.toString("latin1");
  const pages = text.match(/\/Type \/Page(?!s)/g)?.length ?? 0;
  if (pages !== 1) {
    fail(`${side}: expected 1 page, found ${pages}`);
  }
  const box = text.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
  if (!box) {
    fail(`${side}: no MediaBox found`);
  }
  const [width, height] = [Number(box[1]), Number(box[2])];
  if (
    Math.abs(width - PAGE_PT.width) > 0.01 ||
    Math.abs(height - PAGE_PT.height) > 0.01
  ) {
    fail(
      `${side}: page is ${width} x ${height}pt, ` +
        `expected ${PAGE_PT.width} x ${PAGE_PT.height}pt`,
    );
  }
}

// index.html carries a copy of the logo so its fills can be set from
// CSS. The path data is what the copy must keep.
function paths(file: string): string {
  const text = readFileSync(new URL(file, import.meta.url), "utf8");
  return (text.match(/ d="[^"]*"/g) ?? []).join("\n");
}
if (paths("index.html") !== paths("../src/assets/logo.svg")) {
  fail("index.html: the logo differs from src/assets/logo.svg");
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(new URL("index.html", import.meta.url).href);

  // fonts.ready resolves on a failed load too, and the PDF would then
  // carry a fallback font.
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].map((font) => [font.family, font.status]);
  });
  for (const [family, status] of fonts) {
    if (status !== "loaded") {
      fail(`font ${family} is ${status}`);
    }
  }

  for (const side of SIDES) {
    await page.evaluate((side) => {
      document.documentElement.dataset.side = side;
    }, side);
    const pdf = stamp(
      await page.pdf({ preferCSSPageSize: true, printBackground: true }),
    );
    check(pdf, side);
    const file = fileURLToPath(new URL(`${side}.pdf`, import.meta.url));
    writeFileSync(file, pdf);
    process.stdout.write(`${file}\n`);
  }
} finally {
  await browser.close();
}

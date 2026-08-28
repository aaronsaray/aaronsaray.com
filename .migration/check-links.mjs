// Walks every HTML file in dist/ and resolves internal href/src
// targets against dist itself:
//   - path targets must exist (trailing slash -> index.html)
//   - #fragment targets must match an id in the target document
// External URLs, mailto:, javascript:, tel:, data:, and bare "#"
// hrefs are skipped; srcset and content= attributes (og:image) are
// not checked at all. Exits non-zero with a list of broken
// references. Runs in `npm run verify`.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

// id="..." sets per document, extracted lazily for fragment checks.
const idCache = new Map();
function idsOf(file) {
  let ids = idCache.get(file);
  if (!ids) {
    ids = new Set(
      [...fs.readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map(
        (m) => m[1],
      ),
    );
    idCache.set(file, ids);
  }
  return ids;
}

function targetFile(urlPath) {
  const clean = decodeURIComponent(urlPath);
  return clean.endsWith("/")
    ? path.join(DIST, clean, "index.html")
    : path.join(DIST, clean);
}

// Paths served by Cloudflare redirects rather than files in dist.
const redirected = new Set(
  fs
    .readFileSync(path.join(ROOT, "public/_redirects"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split(/\s+/)[0]),
);

// Links that were already broken on the Hugo site (content rot in old
// posts — Aaron's content, not touched by the migration). Warned, not
// fatal.
const knownRot = new Set(
  fs
    .readFileSync(path.join(ROOT, ".migration/known-rot.txt"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#")),
);

const broken = [];
const rotSeen = [];
let checked = 0;

for (const file of htmlFiles(DIST)) {
  // Skip code samples — highlighted code text contains literal,
  // unescaped href="…" sequences that aren't links.
  const html = fs
    .readFileSync(file, "utf8")
    .replace(/<pre[\s\S]*?<\/pre>/g, "");
  const page = "/" + path.relative(DIST, file).replace(/index\.html$/, "");
  // Both quote styles: restored raw HTML in old posts may use single
  // quotes, and a single-quoted broken link should not slip through.
  for (const m of html.matchAll(/\s(?:href|src)=(?:"([^"]+)"|'([^']+)')/g)) {
    const url = m[1] ?? m[2];
    if (/^(https?:|mailto:|javascript:|tel:|data:|#$)/.test(url)) continue;

    let [target, fragment] = url.split("#");
    if (target === "") {
      // same-page fragment
      if (fragment && !idsOf(file).has(fragment)) {
        broken.push(`${page} -> #${fragment} (no such id)`);
      }
      continue;
    }
    if (!target.startsWith("/")) {
      if (knownRot.has(target)) rotSeen.push(`${page} -> ${url}`);
      else broken.push(`${page} -> ${url} (relative URL)`);
      continue;
    }
    checked++;
    if (redirected.has(target)) continue;
    const dest = targetFile(target);
    if (!fs.existsSync(dest)) {
      if (knownRot.has(target)) rotSeen.push(`${page} -> ${url}`);
      else broken.push(`${page} -> ${url} (missing)`);
      continue;
    }
    if (fragment && dest.endsWith(".html") && !idsOf(dest).has(fragment)) {
      broken.push(`${page} -> ${url} (no id "${fragment}")`);
    }
  }
}

console.log(`links: ${checked} internal references checked`);

// The rot exemption is a frozen inventory, not a growing class: a NEW
// link to an already-rotted target would otherwise be excused because
// knownRot matches by target alone. Pin the instance count so any
// drift (up or down) fails loudly and gets a deliberate update here.
const EXPECTED_ROT = 25; // instances as of the Aug 2026 migration
if (rotSeen.length !== EXPECTED_ROT) {
  console.error(
    `known-rot drift: expected ${EXPECTED_ROT} rot links, found ${rotSeen.length}:`,
  );
  for (const r of rotSeen) console.error(`  ${r}`);
  console.error(
    "If this change is intentional, update EXPECTED_ROT in check-links.mjs.",
  );
  process.exitCode = 1;
} else if (rotSeen.length) {
  console.log(`known pre-existing rot (non-fatal): ${rotSeen.length} links`);
}
if (broken.length) {
  console.error(`BROKEN (${broken.length}):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exitCode = 1;
}

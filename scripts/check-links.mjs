// srcset and content= attributes (og:image) are not checked.

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

// Rot in Aaron's prose, not a site bug: warned, not fatal.
const knownRot = new Set(
  fs
    .readFileSync(path.join(import.meta.dirname, "known-rot.txt"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#")),
);

const broken = [];
const rotSeen = [];
let checked = 0;

for (const file of htmlFiles(DIST)) {
  // Skip code samples: highlighted code text contains literal,
  // unescaped href="..." sequences that aren't links.
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
// knownRot matches by target alone. The pinned instance count makes
// any drift (up or down) fail loudly until the pin is updated by hand.
const EXPECTED_ROT = 25;
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

// Content-parity spot check: extracts <main> text from a stratified
// sample of pages in dist/ and in .migration/hugo-baseline/, strips
// tags, decodes entities, collapses whitespace, and word-diffs the
// two. Expected differences ONLY:
//   - "N min read" meta token (new feature)
//   - redesigned old-post notice wording
//   - "#" prefixes on tag links
//   - code-block language labels (new chrome)
//   - restored raw HTML on the pages Hugo stripped ("<!-- raw HTML omitted -->")
// Anything else (lost prose, punctuation drift) needs eyes.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const BASE = path.join(ROOT, ".migration/hugo-baseline");

const SAMPLE = [
  // shortcode strata
  "2021/securing-laravel-from-hackers", // callout
  "2014/3d-printing-makes-manufacturing-more-like-programming", // thumb links
  "2019/2019-goals", // callout
  "2011/google-analytics-campaign-link-builder-bookmarklet", // raw HTML restored
  "2019/didnt-launch-my-startup", // youtube
  "2024/production-merge-in-github-actions", // filename headers
  "2008/xdebug-and-eclipse-pdt-on-windows-from-start-to-finish", // images + fences
  "2017/fixing-laravel-5.4-dependency-on-phpunit-5", // dotted slug
  "2017/my-site-redesign-simpler-faster-but-less-user-friendly", // table
  "2022/breaking-down-laravel-unit-tests-into-types", // laravel CTA
  "2025/stopping-laravel-sql-injection-with-sole", // context pills
  "2026/strava-ios-shortcut-to-start", // newest
  "2007/5-things-this-php-programmer-learned-from-system-ias400-programmers", // oldest era
  "2010/how-to-log-php-errors-like-a-pro",
  "2012/services-mappers-models-enterprise-thinking-in-php-presentation",
  "2015/3-steps-to-the-best-programmers-cover-letter",
  "2020/zabbix-web-scenario-template",
  "2023/self-reflection-as-a-manager",
];

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#34;": '"',
  "&#39;": "'",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&hellip;": "…",
  "&ndash;": "–",
  "&mdash;": "—",
  "&nbsp;": " ",
  "&#xA;": "\n",
  "&middot;": "·",
};

function textOf(file) {
  let html = fs.readFileSync(file, "utf8");
  const m = html.match(/<main[\s\S]*?<\/main>/);
  if (!m) throw new Error(`${file}: no <main>`);
  let text = m[0]
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z#0-9]+;/g, (e) => ENTITIES[e] ?? e);
  return text.replace(/\s+/g, " ").trim();
}

// Normalizations for known deliberate differences.
function normalize(text) {
  return text
    .replace(/\b\d+ min read\b/g, " ")
    .replace(/·/g, " ")
    .replace(/#([a-z0-9-]+)/g, "$1")
    .replace(
      /This post is more than 18 months old\.[\s\S]*?current release\./g,
      " OLDNOTICE ",
    )
    .replace(
      /This post is more than 18 months old\.[\s\S]*?the current\s+release\./g,
      " OLDNOTICE ",
    )
    .replace(/Go to [aA]ll [pP]osts/g, " BACKLINK ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordDiff(a, b) {
  const aw = a.split(" ");
  const bw = b.split(" ");
  // longest common subsequence walk, cheap since posts are small
  const dp = Array.from(
    { length: aw.length + 1 },
    () => new Int32Array(bw.length + 1),
  );
  for (let i = aw.length - 1; i >= 0; i--) {
    for (let j = bw.length - 1; j >= 0; j--) {
      dp[i][j] =
        aw[i] === bw[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const removed = [];
  const added = [];
  let i = 0;
  let j = 0;
  while (i < aw.length && j < bw.length) {
    if (aw[i] === bw[j]) {
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) removed.push(aw[i++]);
    else added.push(bw[j++]);
  }
  removed.push(...aw.slice(i));
  added.push(...bw.slice(j));
  return { removed, added };
}

let clean = 0;
for (const slug of SAMPLE) {
  const hugo = path.join(BASE, slug, "index.html");
  const astro = path.join(DIST, slug, "index.html");
  const a = normalize(textOf(hugo));
  const b = normalize(textOf(astro));
  if (a === b) {
    clean++;
    continue;
  }
  const { removed, added } = wordDiff(a, b);
  console.log(`\n=== ${slug}`);
  console.log(
    `  hugo-only  (${removed.length}): ${removed.slice(0, 40).join(" ")}`,
  );
  console.log(
    `  astro-only (${added.length}): ${added.slice(0, 40).join(" ")}`,
  );
}
console.log(
  `\n${clean}/${SAMPLE.length} pages textually identical after known-diff normalization`,
);

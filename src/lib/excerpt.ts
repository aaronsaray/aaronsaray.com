// The remark half of this pipeline mirrors astro.config.ts (gfm,
// smartypants oldschool, callouts) so an excerpt renders the same
// prose as the post. A change there is mirrored here.

import type { Root } from "hast";
import { toText } from "hast-util-to-text";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remarkCallout } from "../plugins/remark-callout.ts";

const MARKER = "<!--more-->";
const FALLBACK_WORDS = 70;
const MAX_DESCRIPTION = 200;

const pipeline = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants, { dashes: "oldschool" })
  .use(remarkCallout)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify, { allowDangerousHtml: true });

interface Excerpt {
  html: string;
  text: string;
}

const cache = new Map<string, Excerpt>();

// Text from the tree has its entities decoded. Wrapping it back into
// markup must re-escape it or a literal "&" or "<" in post prose becomes
// live markup downstream.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function render(markdown: string): Root {
  return pipeline.runSync(pipeline.parse(markdown));
}

function plainText(tree: Root): string {
  return toText(tree).replace(/\s+/g, " ").trim();
}

function excerpt(body: string): Excerpt {
  const cached = cache.get(body);
  if (cached !== undefined) {
    return cached;
  }

  let result: Excerpt;
  if (body.includes(MARKER)) {
    const tree = render(body.split(MARKER)[0]);
    result = { html: pipeline.stringify(tree).trim(), text: plainText(tree) };
  } else {
    const words = plainText(render(body)).split(" ").slice(0, FALLBACK_WORDS);
    const text = words.join(" ");
    result = { html: `<p>${escapeHtml(text)}</p>`, text };
  }
  cache.set(body, result);
  return result;
}

/** Rendered-HTML excerpt for list display and RSS descriptions. */
export function excerptHtml(body: string): string {
  return excerpt(body).html;
}

function cap(text: string): string {
  if (text.length <= MAX_DESCRIPTION) {
    return text;
  }
  const room = text.slice(0, MAX_DESCRIPTION - 1);
  const cut = room.slice(0, room.lastIndexOf(" "));
  return `${cut.replace(/[\s.,;:!?–—…-]+$/, "")}…`;
}

/** Plain-text excerpt for meta descriptions, capped at 200 characters. */
export function excerptText(body: string): string {
  return cap(excerpt(body).text);
}

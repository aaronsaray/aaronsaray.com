// The remark half of this pipeline mirrors astro.config.mjs (gfm,
// smartypants oldschool, directives) so an excerpt renders the same
// prose as the post. A change there is mirrored here.

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remarkCallout } from "../plugins/remark-callout.mjs";

const MARKER = "<!--more-->";
const FALLBACK_WORDS = 70;

const pipeline = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants, { dashes: "oldschool" })
  .use(remarkDirective)
  .use(remarkCallout)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify, { allowDangerousHtml: true });

const htmlCache = new Map<string, string>();

// toPlainText DECODES entities, so its output is plain text, not
// HTML. Anything wrapping it back into markup must re-escape it or a
// literal "&" or "<" in post prose becomes live markup downstream.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x26;/g, "&")
    .replace(/&#x3C;/g, "<")
    .replace(/\s+/g, " ")
    .trim();
}

/** Rendered-HTML excerpt for list display and RSS descriptions. */
export async function excerptHtml(body: string): Promise<string> {
  const cached = htmlCache.get(body);
  if (cached !== undefined) return cached;

  let html: string;
  if (body.includes(MARKER)) {
    html = String(await pipeline.process(body.split(MARKER)[0])).trim();
  } else {
    const full = String(await pipeline.process(body));
    const words = toPlainText(full).split(" ").slice(0, FALLBACK_WORDS);
    html = `<p>${escapeHtml(words.join(" "))}</p>`;
  }
  htmlCache.set(body, html);
  return html;
}

/** Plain-text excerpt for meta descriptions. */
export async function excerptText(body: string): Promise<string> {
  return toPlainText(await excerptHtml(body));
}

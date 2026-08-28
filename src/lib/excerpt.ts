// Excerpts, Hugo-parity: the markdown before <!--more--> (685 posts
// at the Aug 2026 migration), or a ~70-word plain-text fallback for
// the posts without a marker (22 at migration, inventoried in
// .migration/report.json — no content files were
// edited). Three forms: HTML for list display, HTML for RSS
// descriptions, plain text for meta descriptions.
//
// The mini-pipeline mirrors the site config's remark side (gfm,
// smartypants oldschool, directives) so an excerpt renders the same
// prose as the full post; it skips the heavy rehype chrome (Shiki,
// figures, code controls), which excerpt prose doesn't need.

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
const FALLBACK_WORDS = 70; // Hugo's default summaryLength

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
    // Hugo-parity auto summary: first ~70 words of the rendered
    // content as plain text, no ellipsis.
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

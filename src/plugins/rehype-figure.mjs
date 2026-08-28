import { visit, SKIP } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";

// Lone images become framed figures (see .prose figure). Three shapes:
//
//  1. p > img            — markdown ![alt](src)
//  2. p > a > img        — a markdown image wrapped in a link
//  3. p of raw nodes     — the migrated thumb-link HTML
//                          <a href="full"><img src="thumb"></a> is
//                          inline HTML, so remark leaves it as raw
//                          nodes inside a paragraph. (rehype-raw runs
//                          AFTER user plugins in Astro's pipeline, so
//                          we parse the fragment ourselves.)
//
// A bare <img> alone on its own line is an HTML *block* (root-level
// raw node), handled last. Hand-authored <figure> HTML from the
// migration is left alone — the element CSS styles it directly.

const isWhitespace = (n) => n.type === "text" && !n.value.trim();

const RAW_LINKED_IMG = /^<a\b[^>]*>\s*<img\b[^>]*\/?>\s*<\/a>$/i;
const RAW_IMG = /^<img\b[^>]*\/?>$/i;

function figure(children) {
  return { type: "element", tagName: "figure", properties: {}, children };
}

export function rehypeFigure() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent || index === undefined) return;
      const kids = node.children.filter((n) => !isWhitespace(n));
      if (kids.length === 0) return;

      if (kids.length === 1 && kids[0].type === "element") {
        const el = kids[0];
        const inner = el.children?.filter((n) => !isWhitespace(n)) ?? [];
        const isImg = el.tagName === "img";
        const isLinkedImg =
          el.tagName === "a" &&
          inner.length === 1 &&
          inner[0].type === "element" &&
          inner[0].tagName === "img";
        if (isImg || isLinkedImg) {
          parent.children[index] = figure([el]);
          return SKIP;
        }
      }

      if (kids.every((n) => n.type === "raw")) {
        const html = kids
          .map((n) => n.value)
          .join("")
          .trim();
        if (RAW_LINKED_IMG.test(html) || RAW_IMG.test(html)) {
          parent.children[index] = figure(
            fromHtml(html, { fragment: true }).children,
          );
          return SKIP;
        }
      }
    });

    // Root-level raw <img> blocks.
    visit(tree, "raw", (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (parent.type === "element" && parent.tagName === "figure") return;
      const html = node.value.trim();
      if (RAW_IMG.test(html) || RAW_LINKED_IMG.test(html)) {
        parent.children[index] = figure([node]);
        return SKIP;
      }
    });
  };
}

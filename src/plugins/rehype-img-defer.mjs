import { visit } from "unist-util-visit";

// Adds loading="lazy" + decoding="async" to content images so an
// image-heavy post doesn't fetch every screenshot up front. The FIRST
// image in a document stays eager: near the top of a post it can be
// the LCP element, and lazy-loading the LCP image is the one thing
// this attribute must never do.
//
// Two shapes exist at this point in the pipeline (runs after
// rehype-figure): hast <img> elements (markdown images, plus the raw
// fragments rehype-figure already parsed), and still-raw HTML strings
// (inline <img> inside paragraphs, root-level blocks) which
// rehype-raw parses after user plugins, so those are edited as text.
// visit() is preorder, so "first" means first in document order
// across both shapes.

const RAW_IMG_TAG = /<img\b[^>]*>/gi;

export function rehypeImgDefer() {
  return (tree) => {
    let first = true;
    visit(tree, (node) => {
      if (node.type === "element" && node.tagName === "img") {
        if (first) {
          first = false;
          return;
        }
        node.properties ??= {};
        node.properties.loading ??= "lazy";
        node.properties.decoding ??= "async";
        return;
      }
      if (node.type === "raw" && /<img\b/i.test(node.value)) {
        node.value = node.value.replace(RAW_IMG_TAG, (tag) => {
          if (first) {
            first = false;
            return tag;
          }
          if (/\bloading\s*=/i.test(tag)) return tag;
          return tag.replace(
            /^<img\b/i,
            '<img loading="lazy" decoding="async"',
          );
        });
      }
    });
  };
}

import { visit } from "unist-util-visit";
import { lookupDimensions } from "../lib/imageDimensions.ts";

// width/height are not a rendered size. Browsers map them to an
// aspect-ratio, so paired with the `max-width:100%; height:auto` in
// global.css they reserve the right box before the image loads and
// the article stops reflowing. Dropping that CSS would turn these
// attributes back into fixed pixel sizes.
//
// The FIRST image in a document stays eager: near the top of a post
// it can be the LCP element, and lazy-loading the LCP image is the
// one thing this attribute must never do.
//
// Two shapes exist at this point: hast <img> elements (markdown
// images, plus the fragments rehype-figure already parsed), and
// still-raw HTML strings (inline <img> inside paragraphs, root-level
// blocks), which rehype-raw parses only after user plugins, so those
// are edited as text. visit() is preorder, so "first" means first in
// document order across both shapes.
//
// The dimension lookup is async, and visit() is not, so the walk only
// records what to do; the edits run after every lookup has settled.

const RAW_IMG_TAG = /<img\b[^>]*>/gi;
const RAW_SRC = /\bsrc\s*=\s*["']([^"']*)["']/i;

// A screen capture taken on a high-density display holds several pixels
// for every CSS pixel the page actually showed, and a PNG carries no
// density to say so: nothing under public/uploads/ has a pHYs chunk.
// `@2x` or `@3x` before the extension is that missing declaration, so
// the attributes are the file divided by that factor, which is the size
// the captured UI really was. Without it the browser treats the
// multiplied pixels as width and the screenshot renders that many times
// its true size. Phone captures are commonly 3x: an iPhone Pro's
// 1170x2532 is a 390x844 screen.
const DENSITY = /@([23])x\.[^./]+$/i;

function displaySize(src, size) {
  const scale = Number(DENSITY.exec(src)?.[1] ?? 1);
  return {
    width: Math.round(size.width / scale),
    height: Math.round(size.height / scale),
  };
}

export function rehypeImgAttrs() {
  return async (tree) => {
    const srcs = new Set();
    const edits = [];
    let first = true;

    visit(tree, (node) => {
      if (node.type === "element" && node.tagName === "img") {
        const eager = first;
        first = false;
        node.properties ??= {};
        const src =
          typeof node.properties.src === "string" ? node.properties.src : null;
        if (src) srcs.add(src);
        edits.push((sizes) => {
          const size = src ? sizes.get(src) : null;
          if (size) {
            const { width, height } = displaySize(src, size);
            node.properties.width ??= width;
            node.properties.height ??= height;
          }
          if (eager) return;
          node.properties.loading ??= "lazy";
          node.properties.decoding ??= "async";
        });
        return;
      }
      if (node.type === "raw" && /<img\b/i.test(node.value)) {
        const tags = [];
        for (const [tag] of node.value.matchAll(RAW_IMG_TAG)) {
          const eager = first;
          first = false;
          const hasSize = /\b(width|height)\s*=/i.test(tag);
          const src = hasSize ? null : (RAW_SRC.exec(tag)?.[1] ?? null);
          if (src) srcs.add(src);
          tags.push({ eager, src });
        }
        edits.push((sizes) => {
          let i = 0;
          node.value = node.value.replace(RAW_IMG_TAG, (tag) => {
            const { eager, src } = tags[i++];
            const size = src ? sizes.get(src) : null;
            const shown = size ? displaySize(src, size) : null;
            const dims = shown
              ? ` width="${shown.width}" height="${shown.height}"`
              : "";
            if (eager || /\bloading\s*=/i.test(tag)) {
              return tag.replace(/^<img\b/i, `<img${dims}`);
            }
            return tag.replace(
              /^<img\b/i,
              `<img loading="lazy" decoding="async"${dims}`,
            );
          });
        });
      }
    });

    const sizes = new Map(
      await Promise.all(
        [...srcs].map(async (src) => [src, await lookupDimensions(src)]),
      ),
    );
    for (const edit of edits) edit(sizes);
  };
}

import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { lookupDimensions } from "../lib/imageDimensions.ts";

// `.prose img { max-width: 100%; height: auto }` in global.css is what
// makes width and height an aspect ratio rather than a fixed size.
// `@2x` or `@3x` in a filename is the capture's display density; no
// PNG under public/uploads/ carries one. The attributes are the file's
// pixels divided by it.
// The first image stays eager: near the top of a post it is the LCP
// element.

const DENSITY = /@([23])x\.[^./]+$/i;

export function rehypeImgAttrs() {
  return async (tree: Root) => {
    const images: Element[] = [];
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        images.push(node);
      }
    });
    await Promise.all(
      images.map(async (img, i) => {
        const src = img.properties.src as string;
        const scale = Number(DENSITY.exec(src)?.[1] ?? 1);
        const size = await lookupDimensions(src);
        img.properties.width = Math.round(size.width / scale);
        img.properties.height = Math.round(size.height / scale);
        if (i > 0) {
          img.properties.loading = "lazy";
          img.properties.decoding = "async";
        }
      }),
    );
  };
}

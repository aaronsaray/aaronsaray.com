import type { Element, ElementContent, Root, RootContent } from "hast";
import { visit, SKIP } from "unist-util-visit";

// A paragraph holding only an image, `p > img`, or only a linked
// image, `p > a > img`, becomes a <figure>. `.prose figure` in
// global.css styles it.

const isWhitespace = (n: RootContent) => n.type === "text" && !n.value.trim();

function figure(children: ElementContent[]): Element {
  return { type: "element", tagName: "figure", properties: {}, children };
}

export function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent || index === undefined) {
        return;
      }
      const kids = node.children.filter((n) => !isWhitespace(n));
      if (kids.length !== 1 || kids[0].type !== "element") {
        return;
      }
      const el = kids[0];
      const inner = el.children.filter((n) => !isWhitespace(n));
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
    });
  };
}

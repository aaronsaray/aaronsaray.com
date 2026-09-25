import type { Root } from "hast";
import { visit, SKIP } from "unist-util-visit";

// .prose .table-wrap in global.css is what makes the wrapper scroll.
// tabindex: Firefox and Safari give a scroll container no keyboard
// focus of its own, so without it the table cannot be scrolled from
// the keyboard (WCAG 2.1.1). role and aria-label name that tab stop.
export function rehypeTableWrap() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) {
        return;
      }
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["table-wrap"],
          tabIndex: 0,
          role: "group",
          "aria-label": "Table",
        },
        children: [node],
      };
      return SKIP;
    });
  };
}

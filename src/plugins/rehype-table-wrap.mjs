import { visit, SKIP } from "unist-util-visit";

// .prose .table-wrap in global.css is what makes the wrapper scroll.
// scope="col" is safe to stamp on every <th> because GFM only ever
// emits them inside <thead>.
export function rehypeTableWrap() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      visit(node, "element", (cell) => {
        if (cell.tagName === "th" && cell.properties.scope === undefined) {
          cell.properties.scope = "col";
        }
      });
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-wrap"] },
        children: [node],
      };
      return SKIP;
    });
  };
}

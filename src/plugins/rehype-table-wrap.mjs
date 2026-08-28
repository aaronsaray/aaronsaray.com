import { visit, SKIP } from "unist-util-visit";

// Wrap every table in div.table-wrap so a wide table scrolls inside
// its own container instead of the page (see .prose .table-wrap).
// While here, stamp scope="col" on header cells: GFM emits every
// table's <th> inside <thead>, and screen readers use scope to
// associate data cells with their column.
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

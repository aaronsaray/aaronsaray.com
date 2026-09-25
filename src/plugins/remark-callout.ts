import type { Root } from "mdast";
import { visit } from "unist-util-visit";

const OPEN = ":::callout\n";
const CLOSE = "\n:::";

// A callout is a single paragraph whose first line is `:::callout` and
// whose last is `:::`. A blank line inside one splits the paragraph and
// leaves both markers on the page as text.
export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node, index, parent) => {
      const first = node.children[0];
      const last = node.children.at(-1);
      if (
        first?.type !== "text" ||
        last?.type !== "text" ||
        !first.value.startsWith(OPEN) ||
        !last.value.endsWith(CLOSE)
      ) {
        return;
      }
      first.value = first.value.slice(OPEN.length);
      last.value = last.value.slice(0, -CLOSE.length);
      // mdast has no generic block wrapper; hName renders this one as a div.
      parent!.children[index!] = {
        type: "blockquote",
        children: [node],
        data: { hName: "div", hProperties: { className: ["callout"] } },
      };
    });
  };
}

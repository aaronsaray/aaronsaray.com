import { fromHtml } from "hast-util-from-html";
import { visit, SKIP } from "unist-util-visit";
import { iconFromDisk as icon } from "../lib/icon.mjs";

// Emits the .heading-anchor and .anchor-icon hooks global.css styles.
// anchorDepth is read from the raw frontmatter, which zod output never
// reaches; `depth` is the value for a document without the key.
const ICON = fromHtml(icon("link", { class: "anchor-icon" }), {
  fragment: true,
}).children[0];

const holdsLink = (node) =>
  node.children.some(
    (child) =>
      child.type === "element" && (child.tagName === "a" || holdsLink(child)),
  );

export function rehypeHeadingAnchors({ depth }) {
  return (tree, file) => {
    const max = file.data.astro?.frontmatter?.anchorDepth ?? depth;
    visit(tree, "element", (node) => {
      const rank = /^h[2-6]$/.test(node.tagName) ? Number(node.tagName[1]) : 0;
      if (!rank || rank > max || !node.properties.id) return;
      // Nested anchors are invalid HTML and the parser splits them.
      if (holdsLink(node)) return SKIP;
      node.children = [
        {
          type: "element",
          tagName: "a",
          properties: {
            href: `#${node.properties.id}`,
            className: ["heading-anchor"],
          },
          children: [...node.children, structuredClone(ICON)],
        },
      ];
      return SKIP;
    });
  };
}

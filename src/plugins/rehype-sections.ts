import type { Element, ElementContent, Root, RootContent } from "hast";
import type { VFile } from "vfile";

// Wraps each H2 and what follows it, to the next H2, in a <section>
// when the file's frontmatter sets `sections: true`. The .cv rules in
// global.css hang the date column off that section, and
// `.prose section > * + *` carries the spacing inside it.
export function rehypeSections() {
  return (tree: Root, file: VFile) => {
    if (file.data.astro?.frontmatter?.sections !== true) {
      return;
    }
    const children: RootContent[] = [];
    let section: Element | null = null;
    for (const node of tree.children) {
      if (node.type === "element" && node.tagName === "h2") {
        section = {
          type: "element",
          tagName: "section",
          properties: {},
          children: [],
        };
        children.push(section);
      }
      (section ? section.children : children).push(node as ElementContent);
    }
    tree.children = children;
  };
}

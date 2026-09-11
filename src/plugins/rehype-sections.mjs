// Opt-in per file (frontmatter `sections: true`); run everywhere it
// would pull every post's H2 block out of the `.prose > *` rules.
// `.prose section` in global.css is the matching spacing rule.
export function rehypeSections() {
  return (tree, file) => {
    if (file.data.astro?.frontmatter?.sections !== true) return;
    const children = [];
    let section = null;
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
      (section ? section.children : children).push(node);
    }
    tree.children = children;
  };
}

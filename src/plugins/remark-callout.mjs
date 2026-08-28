import { visit } from "unist-util-visit";

// :::callout container directives (migrated from the Hugo
// header-call-out shortcode) become div.callout.
//
// Every OTHER directive node is restored to the literal text it was
// parsed from. remark-directive's inline syntax is greedy — ":D",
// ":points", "10:30am" all parse as textDirectives — and an unhandled
// directive node renders as an empty element, silently deleting the
// author's text. Restoration makes enabling the plugin safe across
// 707 posts that never opted into directive syntax.
export function remarkCallout() {
  return (tree, file) => {
    visit(tree, (node, index, parent) => {
      if (node.type === "containerDirective" && node.name === "callout") {
        node.data = { hName: "div", hProperties: { className: ["callout"] } };
        return;
      }

      if (node.type === "textDirective") {
        const replacement = [{ type: "text", value: `:${node.name}` }];
        if (node.children?.length) {
          replacement.push({ type: "text", value: "[" }, ...node.children, {
            type: "text",
            value: "]",
          });
        }
        if (node.attributes && Object.keys(node.attributes).length) {
          // Attribute syntax can't be restored losslessly; flag it.
          console.warn(
            `[remark-callout] dropped attributes on ":${node.name}" in ${file?.path ?? "unknown file"}`,
          );
        }
        parent.children.splice(index, 1, ...replacement);
        return index + replacement.length;
      }

      if (node.type === "leafDirective" || node.type === "containerDirective") {
        const marker = node.type === "leafDirective" ? "::" : ":::";
        console.warn(
          `[remark-callout] restored unexpected ${node.type} "${marker}${node.name}" in ${file?.path ?? "unknown file"}`,
        );
        parent.children.splice(
          index,
          1,
          {
            type: "paragraph",
            children: [{ type: "text", value: `${marker}${node.name}` }],
          },
          ...node.children,
        );
        return index + 1 + node.children.length;
      }
    });
  };
}

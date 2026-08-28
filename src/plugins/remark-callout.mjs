import { visit } from "unist-util-visit";

// :::callout container directives (migrated from the Hugo
// header-call-out shortcode) become div.callout.
//
// Every OTHER directive node is restored to the literal text it was
// parsed from. remark-directive's inline syntax is greedy — ":D",
// ":points", "10:30am" all parse as textDirectives — and an unhandled
// directive node renders as an empty element, silently deleting the
// author's text. Restoration makes enabling the plugin safe across
// the corpus (707 posts at the Aug 2026 migration) that never opted
// into directive syntax. The two cases restoration can't do
// losslessly THROW rather than warn: a build-time warning scrolls
// away and altered prose ships; a crash names the file.
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
          // Attribute syntax can't be restored losslessly: refuse to
          // ship prose with the {...} text silently deleted.
          throw new Error(
            `[remark-callout] cannot restore attributes on ":${node.name}" in ${file?.path ?? "unknown file"}; rework the text or handle the directive`,
          );
        }
        parent.children.splice(index, 1, ...replacement);
        return index + replacement.length;
      }

      if (node.type === "leafDirective" || node.type === "containerDirective") {
        // Block-directive restoration is an approximation of the
        // original source, not the source itself: don't ship it.
        const marker = node.type === "leafDirective" ? "::" : ":::";
        throw new Error(
          `[remark-callout] unexpected ${node.type} "${marker}${node.name}" in ${file?.path ?? "unknown file"}; restoration would approximate the author's text`,
        );
      }
    });
  };
}

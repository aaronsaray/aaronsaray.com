import { visit, SKIP } from "unist-util-visit";
import { iconFromDisk as icon } from "../lib/icon.mjs";

// Two DOM shapes. The inline copy script in [year]/[slug].astro
// resolves its <pre> from them (`.filename-header` via
// nextElementSibling, `.code-wrap` via querySelector('pre')):
//
//  with data-filename (fence meta filename="…"):
//    <div class="filename-header">icon <span class="filename-text">…</span>
//      <span class="code-controls">lang + copy</span></div>
//    <pre class="astro-code">…</pre>
//
//  bare:
//    <div class="code-wrap"><pre class="astro-code">…</pre>
//      <div class="code-controls">lang + copy</div></div>
//
// A fence language of `output` takes the bare shape with `is-output`
// and controls that carry no copy button.
//
// The chrome is emitted as raw HTML nodes; Astro's pipeline runs
// rehype-raw after user plugins, which parses them into the tree.

const FILE_ICONS = {
  php: "file-type-php",
  html: "file-type-html",
  javascript: "file-type-js",
  js: "file-type-js",
  css: "file-type-css",
  sql: "file-type-sql",
  xml: "file-type-xml",
  txt: "file-type-txt",
};

const COPY_BUTTON =
  '<button class="copy-btn" type="button" aria-label="Copy code">' +
  icon("copy", { class: "icon-copy", strokeWidth: 1.75 }) +
  icon("check", { class: "icon-check" }) +
  "</button>";

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fileIcon(lang) {
  return icon(FILE_ICONS[lang] ?? "file-code", {
    class: "size-3.5 shrink-0",
    strokeWidth: 1.75,
  });
}

function controls(lang, tag) {
  return (
    `<${tag} class="code-controls">` +
    `<span class="code-lang">${escapeHtml(lang)}</span>` +
    COPY_BUTTON +
    `</${tag}>`
  );
}

function outputControls() {
  return (
    '<div class="code-controls">' +
    icon("terminal-2", { class: "size-3.5 shrink-0", strokeWidth: 1.75 }) +
    '<span class="code-lang">output</span>' +
    "</div>"
  );
}

function filenameHeader(filename, lang) {
  return (
    '<div class="filename-header">' +
    fileIcon(lang) +
    `<span class="filename-text">${escapeHtml(filename)}</span>` +
    controls(lang, "span") +
    "</div>"
  );
}

function wrapBlock(parent, index, node, controlsHtml, extraClass) {
  parent.children[index] = {
    type: "element",
    tagName: "div",
    properties: {
      className: extraClass ? ["code-wrap", extraClass] : ["code-wrap"],
    },
    children: [node, { type: "raw", value: controlsHtml }],
  };
  return SKIP;
}

export function rehypeCodeChrome() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      // Astro's Shiki wrapper sets `properties.class` (not the hast
      // convention `className`), so accept either.
      const cls = node.properties?.className ?? node.properties?.class;
      const classes = Array.isArray(cls) ? cls : String(cls ?? "").split(" ");
      if (!classes.includes("astro-code")) return;

      const dataLang = String(node.properties.dataLanguage ?? "plaintext");
      const filename = node.properties.dataFilename;

      // A block that scrolls is unreachable by keyboard unless it is
      // focusable (WCAG 2.1.1). The group role gives the stop a name;
      // without it a screen reader lands on unlabeled content.
      node.properties.tabIndex = 0;
      node.properties.role = "group";

      if (dataLang === "output") {
        node.properties["aria-label"] = "Terminal output";
        return wrapBlock(parent, index, node, outputControls(), "is-output");
      }

      const lang = dataLang === "plaintext" ? "txt" : dataLang;
      node.properties["aria-label"] =
        filename != null ? `Code: ${String(filename)}` : `Code: ${lang}`;

      if (filename != null) {
        delete node.properties.dataFilename;
        parent.children.splice(index, 0, {
          type: "raw",
          value: filenameHeader(String(filename), lang),
        });
        return index + 2;
      }

      return wrapBlock(parent, index, node, controls(lang, "div"));
    });
  };
}

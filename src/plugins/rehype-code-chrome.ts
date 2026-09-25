import type { Element, Root } from "hast";
import { visit, SKIP } from "unist-util-visit";
import { iconFromDisk as icon } from "../lib/icon.ts";
import { escapeHtml } from "../lib/escapeHtml.ts";

// Two DOM shapes. The copy script in [year]/[slug].astro finds its
// <pre> from them (`.filename-header` via nextElementSibling,
// `.code-wrap` via querySelector('pre')), and global.css styles them:
//
//  fence meta filename="…":
//    <div class="filename-header">icon <span class="filename-text">…</span>
//      <div class="code-controls">lang + copy</div></div>
//    <pre class="astro-code">…</pre>
//
//  bare:
//    <div class="code-wrap"><pre class="astro-code">…</pre>
//      <div class="code-controls">lang + copy</div></div>
//
// A fence language of `output` takes the bare shape with `is-output`
// and no copy button.

// Keyed by the fence language. Any other language gets file-code.
const FILE_ICONS: Record<string, string> = {
  php: "file-type-php",
  html: "file-type-html",
  javascript: "file-type-js",
  js: "file-type-js",
  css: "file-type-css",
  sql: "file-type-sql",
  xml: "file-type-xml",
  txt: "file-type-txt",
};

const HEADER_ICON = { class: "size-3.5 shrink-0", strokeWidth: 1.75 };

const COPY_BUTTON =
  '<button class="copy-btn" aria-label="Copy code">' +
  icon("copy", { class: "icon-copy", strokeWidth: 1.75 }) +
  icon("check", { class: "icon-check" }) +
  "</button>";

function controls(inner: string) {
  return `<div class="code-controls">${inner}</div>`;
}

function langLabel(lang: string) {
  return `<span class="code-lang">${escapeHtml(lang)}</span>`;
}

function filenameHeader(filename: string, lang: string) {
  return (
    '<div class="filename-header">' +
    icon(FILE_ICONS[lang] ?? "file-code", HEADER_ICON) +
    `<span class="filename-text">${escapeHtml(filename)}</span>` +
    controls(langLabel(lang) + COPY_BUTTON) +
    "</div>"
  );
}

function codeWrap(pre: Element, controlsHtml: string, ...classes: string[]) {
  const wrap: Element = {
    type: "element",
    tagName: "div",
    properties: { className: ["code-wrap", ...classes] },
    children: [pre, { type: "raw", value: controlsHtml }],
  };
  return wrap;
}

export function rehypeCodeChrome() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) {
        return;
      }
      const dataLang = node.properties.dataLanguage as string;
      const filename = node.properties.dataFilename as string | undefined;

      // A block that scrolls is unreachable by keyboard unless it is
      // focusable (WCAG 2.1.1). The group role gives the stop a name;
      // without it a screen reader lands on unlabeled content.
      node.properties.tabIndex = 0;
      node.properties.role = "group";

      if (dataLang === "output") {
        node.properties["aria-label"] = "Terminal output";
        parent.children[index] = codeWrap(
          node,
          controls(icon("terminal-2", HEADER_ICON) + langLabel("output")),
          "is-output",
        );
        return SKIP;
      }

      const lang = dataLang === "plaintext" ? "txt" : dataLang;
      node.properties["aria-label"] = `Code: ${filename ?? lang}`;

      if (filename === undefined) {
        parent.children[index] = codeWrap(
          node,
          controls(langLabel(lang) + COPY_BUTTON),
        );
        return SKIP;
      }

      delete node.properties.dataFilename;
      parent.children.splice(index, 0, {
        type: "raw",
        value: filenameHeader(filename, lang),
      });
      // The splice moved the pre to index + 1; anything less revisits it.
      return index + 2;
    });
  };
}

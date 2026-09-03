import { visit, SKIP } from "unist-util-visit";
import { iconFromDisk as icon } from "../lib/icon.mjs";

// Runs after Astro's Shiki pass. Emits two DOM shapes; the inline
// copy script's element lookups depend on them exactly
// (`.filename-header` → nextElementSibling, `.code-wrap` →
// querySelector('pre')):
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
// The chrome is emitted as raw HTML nodes; Astro's pipeline runs
// rehype-raw after user plugins, which parses them into the tree.

// Per-language file-type icons where Tabler has one for a language in
// the corpus, file-code as the fallback.
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

function filenameHeader(filename, lang) {
  return (
    '<div class="filename-header">' +
    fileIcon(lang) +
    `<span class="filename-text">${escapeHtml(filename)}</span>` +
    controls(lang, "span") +
    "</div>"
  );
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
      const lang = dataLang === "plaintext" ? "txt" : dataLang;
      const filename = node.properties.dataFilename;

      if (filename != null) {
        delete node.properties.dataFilename;
        parent.children.splice(index, 0, {
          type: "raw",
          value: filenameHeader(String(filename), lang),
        });
        return index + 2;
      }

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-wrap"] },
        children: [node, { type: "raw", value: controls(lang, "div") }],
      };
      return SKIP;
    });
  };
}

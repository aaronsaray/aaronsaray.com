import { visit, SKIP } from "unist-util-visit";

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

// Tabler icons (outline, v3): per-language file-type icons where one
// exists for a language in the corpus, file-code as the fallback.
const ICON_PATHS = {
  php: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
    "M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6",
    "M17 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6",
    "M11 21v-6",
    "M14 15v6",
    "M11 18h3",
  ],
  html: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
    "M2 21v-6",
    "M5 15v6",
    "M2 18h3",
    "M20 15v6h2",
    "M13 21v-6l2 3l2 -3v6",
    "M7.5 15h3",
    "M9 15v6",
  ],
  javascript: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M3 15h3v4.5a1.5 1.5 0 0 1 -3 0",
    "M9 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1",
  ],
  css: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
    "M8 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0",
    "M11 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75",
    "M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75",
  ],
  sql: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M5 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
    "M18 15v6h2",
    "M13 15a2 2 0 0 1 2 2v2a2 2 0 1 1 -4 0v-2a2 2 0 0 1 2 -2",
    "M14 20l1.5 1.5",
  ],
  xml: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
    "M4 15l4 6",
    "M4 21l4 -6",
    "M19 15v6h3",
    "M11 21v-6l2.5 3l2.5 -3v6",
  ],
  txt: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M16.5 15h3",
    "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
    "M4.5 15h3",
    "M6 15v6",
    "M18 15v6",
    "M10 15l4 6",
    "M10 21l4 -6",
  ],
  _file: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2",
    "M10 13l-1 2l1 2",
    "M14 13l1 2l-1 2",
  ],
};
ICON_PATHS.js = ICON_PATHS.javascript;

const COPY_BUTTON =
  '<button class="copy-btn" type="button" aria-label="Copy code">' +
  '<svg class="icon-copy" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/></svg>' +
  '<svg class="icon-check" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>' +
  "</button>";

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fileIcon(lang) {
  const paths = ICON_PATHS[lang] ?? ICON_PATHS._file;
  return (
    '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
    paths.map((d) => `<path d="${d}"/>`).join("") +
    "</svg>"
  );
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
      // convention `className`) — accept either.
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

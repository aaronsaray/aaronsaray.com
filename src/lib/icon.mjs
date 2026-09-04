import { readFileSync } from "node:fs";

// The file's own <svg> wrapper is discarded so every caller gets the
// same attributes and controls class and stroke width.
/**
 * @param {string} svg
 * @param {{ class?: string; strokeWidth?: number }} [options]
 */
export function iconMarkup(svg, { class: className, strokeWidth = 2 } = {}) {
  const body = svg
    .slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"))
    .trim();
  const cls = className ? ` class="${className.replace(/"/g, "&quot;")}"` : "";
  return (
    `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
    body +
    "</svg>"
  );
}

// For the markdown plugins, which astro.config.mjs loads outside Vite.
// Components go through Icon.astro instead: once Vite bundles this
// module, import.meta.url no longer points at src/.
const dir = new URL("../icons/", import.meta.url);
const files = new Map();

/**
 * @param {string} name
 * @param {{ class?: string; strokeWidth?: number }} [options]
 */
export function iconFromDisk(name, options) {
  let svg = files.get(name);
  if (svg === undefined) {
    svg = readFileSync(new URL(`${name}.svg`, dir), "utf8");
    files.set(name, svg);
  }
  return iconMarkup(svg, options);
}

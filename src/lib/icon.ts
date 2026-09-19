import { readFileSync } from "node:fs";

// The file's own <svg> wrapper is discarded so every caller gets the
// same attributes and controls class and stroke width.
type IconOptions = { class?: string; strokeWidth?: number };

export function iconMarkup(
  svg: string,
  { class: className, strokeWidth = 2 }: IconOptions = {},
) {
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

// For the markdown plugins, which astro.config.ts loads unbundled.
// Components go through Icon.astro instead: once Vite bundles this
// module, import.meta.url no longer points at src/.
const dir = new URL("../icons/", import.meta.url);
const files = new Map<string, string>();

export function iconFromDisk(name: string, options?: IconOptions) {
  let svg = files.get(name);
  if (svg === undefined) {
    svg = readFileSync(new URL(`${name}.svg`, dir), "utf8");
    files.set(name, svg);
  }
  return iconMarkup(svg, options);
}

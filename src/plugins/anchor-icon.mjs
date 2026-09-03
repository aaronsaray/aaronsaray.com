import { fromHtml } from "hast-util-from-html";
import { iconFromDisk as icon } from "../lib/icon.mjs";

// Appended after the heading text by rehype-autolink-headings
// (behavior: wrap).
export const anchorIcon = fromHtml(icon("link", { class: "anchor-icon" }), {
  fragment: true,
}).children[0];

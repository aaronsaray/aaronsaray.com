import { fromHtml } from "hast-util-from-html";
import { iconFromDisk as icon } from "../lib/icon.mjs";

// The `content` of the rehype-autolink-headings entry in astro.config.mjs.
export const anchorIcon = fromHtml(icon("link", { class: "anchor-icon" }), {
  fragment: true,
}).children[0];

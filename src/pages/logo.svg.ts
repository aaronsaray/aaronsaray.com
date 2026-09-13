import type { APIRoute } from "astro";
import asset from "../assets/logo.svg?raw";

// /logo.svg is linked from outside the site, so it serves plain fills
// that need nothing from a page.
const FILL = /style="fill: var\(--logo-[a-z]+, (#[0-9a-f]{6})\)"/g;

export const GET: APIRoute = () => {
  let count = 0;
  const svg = asset.replace(FILL, (_, hex: string) => {
    count += 1;
    return `fill="${hex}"`;
  });
  if (count !== 2) {
    throw new Error(
      `logo.svg: expected 2 custom-property fills, found ${count}. ` +
        'Each path needs style="fill: var(--logo-NAME, #rrggbb)" ' +
        "with a 6-digit lowercase hex.",
    );
  }
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
};

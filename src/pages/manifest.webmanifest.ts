import type { APIRoute } from "astro";
import { publicImageSize } from "../lib/ogImage";
import { SITE_NAME, THEME_COLOR } from "../lib/site";

const ICON = "/favicon.png";

export const GET: APIRoute = async () => {
  const { width, height } = await publicImageSize(ICON);

  return new Response(
    JSON.stringify({
      name: SITE_NAME,
      theme_color: THEME_COLOR,
      icons: [{ src: ICON, sizes: `${width}x${height}`, type: "image/png" }],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
};

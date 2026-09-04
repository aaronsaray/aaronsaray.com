import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { excerptHtml } from "../../lib/excerpt";
import { renderFeed, feedResponse, RSS_LIMIT, SITE_URL } from "../../lib/rss";

export const GET: APIRoute = async () => {
  const tags = (await getCollection("tags")).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );
  const items = await Promise.all(
    tags.slice(0, RSS_LIMIT).map(async (entry) => ({
      title: entry.data.title,
      link: `${SITE_URL}/tag/${entry.id}/`,
      descriptionHtml: await excerptHtml(entry.body ?? ""),
    })),
  );
  return feedResponse(
    renderFeed({
      title: "Blog Tags",
      path: "/tag/",
      selfPath: "/tag/index.xml",
      items,
    }),
  );
};

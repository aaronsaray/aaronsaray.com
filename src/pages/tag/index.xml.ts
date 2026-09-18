import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { excerptHtml } from "../../lib/excerpt";
import { renderFeed, feedResponse, RSS_LIMIT, SITE_URL } from "../../lib/rss";
import { tagTitle } from "../../lib/tags";

export const GET: APIRoute = async () => {
  const tags = (await getCollection("tags")).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  const items = await Promise.all(
    tags.slice(0, RSS_LIMIT).map(async (entry) => ({
      title: tagTitle(entry.id),
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

import type { APIRoute } from "astro";
import { getSortedPosts, postHref } from "../../lib/posts";
import { excerptHtml } from "../../lib/excerpt";
import { feed, RSS_LIMIT, SITE_URL } from "../../lib/rss";
import { SITE_DESCRIPTION, SITE_NAME } from "../../lib/site";

export const GET: APIRoute = async () => {
  const posts = (await getSortedPosts()).slice(0, RSS_LIMIT);
  const items = posts.map((post) => ({
    title: post.data.title,
    link: `${SITE_URL}${postHref(post)}`,
    date: post.data.date,
    descriptionHtml: excerptHtml(post.body),
  }));
  return feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/blog/",
    selfPath: "/blog/index.xml",
    items,
  });
};

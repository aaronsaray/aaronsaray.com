import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts, postHref } from "../../../lib/posts";
import { excerptHtml } from "../../../lib/excerpt";
import {
  renderFeed,
  feedResponse,
  RSS_LIMIT,
  SITE_URL,
} from "../../../lib/rss";

export async function getStaticPaths() {
  const tags = await getCollection("tags");
  return tags.map((entry) => ({
    params: { tag: entry.id },
    props: { title: entry.data.title },
  }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const term = params.tag as string;
  const posts = (await getSortedPosts())
    .filter((post) => post.data.tags.includes(term))
    .slice(0, RSS_LIMIT);
  const items = await Promise.all(
    posts.map(async (post) => ({
      title: post.data.title,
      link: `${SITE_URL}${postHref(post)}`,
      date: post.data.date,
      descriptionHtml: await excerptHtml(post.body ?? ""),
    })),
  );
  return feedResponse(
    renderFeed({
      title: props.title,
      path: `/tag/${term}/`,
      selfPath: `/tag/${term}/index.xml`,
      items,
    }),
  );
};

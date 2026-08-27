import type { APIRoute } from 'astro';
import { getSortedPosts, postHref } from '../../lib/posts';
import { excerptHtml } from '../../lib/excerpt';
import { renderFeed, feedResponse, RSS_LIMIT, SITE_URL } from '../../lib/rss';

export const GET: APIRoute = async () => {
  const posts = (await getSortedPosts()).slice(0, RSS_LIMIT);
  const items = await Promise.all(
    posts.map(async (post) => ({
      title: post.data.title,
      link: `${SITE_URL}${postHref(post)}`,
      date: post.data.date,
      descriptionHtml: await excerptHtml(post.body ?? ''),
    })),
  );
  return feedResponse(
    renderFeed({
      title: 'Blog Posts',
      path: '/blog/',
      selfPath: '/blog/index.xml',
      items,
    }),
  );
};

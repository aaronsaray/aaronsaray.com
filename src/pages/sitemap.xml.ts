import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts, postHref } from "../lib/posts";
import { SITE_URL } from "../lib/rss";

// Same URL categories as Hugo's sitemap (verified identical to the
// Hugo output, 764 urls, at the Aug 2026 migration; grows with new
// posts and tags) plus the pages new with the redesign: books and
// who-am-i. lastmod is the post's own date; list pages get the newest
// date they cover; cv/contact lost their dates in migration and the
// new pages have none, so no lastmod there.

/** Frontmatter date -> full ISO form Hugo used in lastmod. */
function lastmod(date: string): string {
  return date.length > 10 ? date : `${date}T00:00:00+00:00`;
}

function url(path: string, mod?: string): string {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>${mod ? `\n    <lastmod>${mod}</lastmod>` : ""}
  </url>`;
}

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const newest = lastmod(posts[0].data.date);
  const entries: string[] = [];

  entries.push(url("/", newest));
  entries.push(url("/who-am-i/"));
  entries.push(url("/cv/"));
  entries.push(url("/books/"));
  entries.push(url("/contact/"));
  entries.push(url("/blog/", newest));
  entries.push(url("/tag/", newest));

  const tags = (await getCollection("tags")).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  for (const tag of tags) {
    const newestInTag = posts.find((p) => p.data.tags.includes(tag.id));
    entries.push(
      url(`/tag/${tag.id}/`, newestInTag && lastmod(newestInTag.data.date)),
    );
  }

  for (const post of posts) {
    entries.push(url(postHref(post), lastmod(post.data.date)));
  }

  const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

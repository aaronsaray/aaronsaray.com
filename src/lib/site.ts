import { getCollection } from 'astro:content';

/** Published (non-draft) blog entries — the number the footer CTA and /tag/ show. */
export async function getPostCount(): Promise<number> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.length;
}

import { getCollection } from "astro:content";

/** The Hugo site description, reused as the default meta description. */
export const SITE_DESCRIPTION =
  "Open Source Consultant specializing in building effective software for startups and SMBs.";

/**
 * Published (non-draft) blog entries; used by the footer CTA. The blog
 * index and /tag/ show the same number but compute it themselves via
 * getSortedPosts(), so a change here does not follow to those pages.
 */
export async function getPostCount(): Promise<number> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.length;
}

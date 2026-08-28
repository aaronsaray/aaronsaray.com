import { getCollection } from "astro:content";

/** The Hugo site description, reused as the default meta description. */
export const SITE_DESCRIPTION =
  "Open Source Consultant specializing in building effective software for startups and SMBs.";

/** Published (non-draft) blog entries — the number the footer CTA and /tag/ show. */
export async function getPostCount(): Promise<number> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.length;
}

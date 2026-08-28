// New with the redesign (no Hugo counterpart): the "N min read" on the
// post meta line. ceil(words / 200) over the prose — code blocks, HTML
// tags, and image syntax don't count as words.
export function readingTime(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<!--more-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

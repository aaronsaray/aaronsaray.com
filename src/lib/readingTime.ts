export function readingTime(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<!--more-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200);
}

import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { imageMetadata } from "astro/assets/utils";

const PUBLIC_DIR = fileURLToPath(new URL("../../public/", import.meta.url));

export type Dimensions = { width: number; height: number };

// Same src resolves once per build no matter how many posts use it.
// The promise is cached, not the result, so concurrent posts sharing
// an image wait on one read instead of racing to start their own.
const cache = new Map<string, Promise<Dimensions | null>>();

async function read(src: string): Promise<Dimensions | null> {
  // Anything not rooted at / is a relative path inside a code sample,
  // not a real asset reference.
  if (!src.startsWith("/")) return null;

  // A src is untrusted text from markdown; keep the read inside
  // public/ so "/../.." cannot walk out of it.
  const path = normalize(join(PUBLIC_DIR, src));
  if (!path.startsWith(PUBLIC_DIR)) return null;

  try {
    // imageMetadata already swaps width and height for a JPEG whose
    // EXIF orientation rotates it, so the box matches what renders.
    const { width, height } = await imageMetadata(await readFile(path), src);
    return { width, height };
  } catch {
    // A missing file or an unparseable one (posts reference both: an
    // XSS demo points <img> at a .php). Callers stamp nothing and the
    // build carries on.
    return null;
  }
}

export function lookupDimensions(src: string): Promise<Dimensions | null> {
  let hit = cache.get(src);
  if (!hit) {
    hit = read(src);
    cache.set(src, hit);
  }
  return hit;
}

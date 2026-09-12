import { join } from "node:path";

// One post with draft: true, written into the blog collection by
// tests/global-setup.ts and removed by tests/global-teardown.ts, so the
// draft code paths run without a draft living in the repo. The dev
// server picks it up through its file watcher. The filename is also in
// .gitignore and in the Makefile clean target for a run that dies
// before teardown.
const slug = "draft-fixture-for-tests";

export const DRAFT_FIXTURE = {
  file: join(import.meta.dirname, "../src/content/blog", `${slug}.md`),
  path: `/2026/${slug}/`,
  title: "Draft fixture",
  tag: "php",
  source: [
    "---",
    "title: Draft fixture",
    'date: "2026-01-01"',
    "tags: [php]",
    "draft: true",
    "---",
    "Test fixture. Never in a build.",
    "",
  ].join("\n"),
};

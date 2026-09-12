import { writeFileSync } from "node:fs";
import type { FullConfig } from "@playwright/test";
import { DRAFT_FIXTURE } from "./draft-fixture";

// Playwright starts webServer before this runs, so the file lands in a
// watched directory and the route appears once the content layer has
// synced it; polling the route is what proves that happened.
export default async function globalSetup(config: FullConfig) {
  writeFileSync(DRAFT_FIXTURE.file, DRAFT_FIXTURE.source);
  const url = new URL(DRAFT_FIXTURE.path, config.webServer?.url).href;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const response = await fetch(url).catch(() => null);
    if (response?.status === 200) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(
    `${url} never answered 200 after the draft fixture was written`,
  );
}

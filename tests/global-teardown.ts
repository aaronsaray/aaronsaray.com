import { rmSync } from "node:fs";
import { DRAFT_FIXTURE } from "./draft-fixture";

export default function globalTeardown() {
  rmSync(DRAFT_FIXTURE.file, { force: true });
}

// Verifies every path in url-contract.txt is served by dist/:
//   - paths ending in / must have dist/<path>/index.html
//   - file paths must exist verbatim
// Exits non-zero listing anything missing. Runs in `npm run verify`.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const FIXTURE = path.join(ROOT, '.migration/url-contract.txt');

const paths = fs
  .readFileSync(FIXTURE, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));

const missing = [];
for (const p of paths) {
  const rel = p.endsWith('/') ? `${p}index.html` : p;
  if (!fs.existsSync(path.join(DIST, rel))) missing.push(p);
}

console.log(`url contract: ${paths.length - missing.length}/${paths.length} served`);
if (missing.length) {
  console.error('MISSING:');
  for (const p of missing) console.error(`  ${p}`);
  process.exitCode = 1;
}

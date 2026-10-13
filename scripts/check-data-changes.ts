/**
 * npm run data:diff                  → compares src/data with the last commit (HEAD)
 * npm run data:diff -- --base <ref>  → compares with another commit or branch
 *
 * Fails when a fact changed without bumping its `updated` date. Together with the
 * integrity rule "every `updated` date needs a changelog entry that references the
 * record", this keeps the changelog in step with every data update.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { diffRecords, type DiffProblem } from '../src/lib/data-diff';

const root = fileURLToPath(new URL('..', import.meta.url));
const index = process.argv.indexOf('--base');
const base = index === -1 ? 'HEAD' : process.argv[index + 1];
const FILES: [string, string][] = [
  ['changes.json', 'change'],
  ['milestones.json', 'milestone'],
  ['abilities.json', 'ability'],
  ['facts.json', 'fact'],
  ['builds.json', 'build'],
  ['races.json', 'race'],
];

function previousVersion(file: string): unknown[] | undefined {
  if (!base || /^0+$/.test(base)) return undefined; // first push of a branch
  try {
    const text = execFileSync('git', ['show', `${base}:src/data/${file}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return JSON.parse(text) as unknown[];
  } catch {
    return undefined; // no commit yet, or the file did not exist
  }
}

const problems: DiffProblem[] = [];
let compared = 0;
for (const [file, kind] of FILES) {
  const before = previousVersion(file);
  if (!before) continue;
  compared++;
  const after = JSON.parse(readFileSync(`${root}/src/data/${file}`, 'utf8')) as unknown[];
  problems.push(...diffRecords(file, kind, before as Record<string, unknown>[], after as Record<string, unknown>[]));
}

if (compared === 0) {
  console.log(`ℹ Nothing to compare against "${base}" (no previous commit). Skipped.`);
  process.exit(0);
}
for (const p of problems.filter((p) => p.severity === 'warning')) console.warn(`⚠ ${p.ref}: ${p.message}`);
const errors = problems.filter((p) => p.severity === 'error');
if (errors.length > 0) {
  for (const p of errors) console.error(`✗ ${p.ref}: ${p.message}`);
  console.error('\nSet "updated" to today on those records and reference them from a changelog entry of the same date.');
  process.exit(1);
}
console.log(`✓ Data changes since ${base} are documented.`);

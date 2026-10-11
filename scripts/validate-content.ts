/**
 * npm run validate
 *
 * 1. Parses every data file (src/data/*.json) and checks cross-file integrity.
 * 2. Checks every MDX page: frontmatter, references, components, coverage.
 * Exits with code 1 on any error. Warnings (drafts, TODOs) do not fail.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dataset } from '../src/lib/data';
import { validatePages, type PageFile } from '../src/lib/page-rules';

const root = fileURLToPath(new URL('..', import.meta.url));
const pagesDir = join(root, 'src', 'content', 'pages');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.mdx') ? [full] : [];
  });
}

// Importing ../src/lib/data already validated the JSON files (it throws on problems).
console.log(
  `✓ Data: ${dataset.sources.length} sources, ${dataset.changes.length} changes, ${dataset.milestones.length} milestones, ` +
    `${dataset.abilities.length} abilities, ${dataset.facts.length} facts, ${dataset.changelog.length} changelog entries`,
);

const files: PageFile[] = walk(pagesDir).map((full) => ({
  path: relative(pagesDir, full).replaceAll('\\', '/'),
  content: readFileSync(full, 'utf8'),
}));

const ogDir = join(root, 'public', 'og');
const ogImages = new Set(existsSync(ogDir) ? readdirSync(ogDir) : []);
const { errors, warnings } = validatePages(files, dataset, new Date(), { ogImages });
for (const warning of warnings) console.warn(`⚠ ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`\n${errors.length} content error(s).`);
  process.exit(1);
}
console.log(`✓ Pages: ${files.length} MDX files valid`);

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { dataset } from '../src/lib/data';
import { MDX_COMPONENTS, validatePages, type PageFile } from '../src/lib/page-rules';
import { LOCALES, PAGE_IDS } from '../src/i18n/routes';

function page(locale: string, pageId: string, body = '', extra = ''): PageFile {
  return {
    path: `${locale}/${pageId}.mdx`,
    content: `---
pageId: ${pageId}
locale: ${locale}
title: A valid page title
description: A description that is long enough to satisfy the schema rules for meta descriptions.
gameVersion: forever-beta-2026-10
published: 2026-10-11
reviewed: 2026-10-11
reviewedBy: Test
status: published
verification: verified
sources: [blizzard-deep-dive-mage]
${extra}---
${body}
`,
  };
}

const complete = LOCALES.flatMap((l) => PAGE_IDS.map((id) => page(l, id)));
const today = new Date('2026-10-12T00:00:00Z');

describe('validatePages', () => {
  it('accepts a complete, consistent set of pages', () => {
    expect(validatePages(complete, dataset, today).errors).toEqual([]);
  });

  it('reports a page missing in one locale', () => {
    const files = complete.filter((f) => f.path !== 'en/gear.mdx');
    expect(validatePages(files, dataset, today).errors).toContain('missing published page "gear" for locale "en"');
  });

  it('catches unknown components, statuses, links and facts', () => {
    const body = '<Pendig why="x" />\n<Status status="maybe" />\n<PageLink to="nowhere">x</PageLink>\n<FactList ids={[\'launch\', \'nope\']} />';
    const files = [...complete.filter((f) => f.path !== 'es/guide.mdx'), page('es', 'guide', body)];
    const errors = validatePages(files, dataset, today).errors.join('\n');
    expect(errors).toMatch(/unknown component <Pendig>/);
    expect(errors).toMatch(/unknown status "maybe"/);
    expect(errors).toMatch(/to="nowhere"/);
    expect(errors).toMatch(/unknown fact "nope"/);
    expect(errors).not.toMatch(/"launch"/);
  });

  it('rejects future review dates and mismatched folders', () => {
    const future = page('es', 'guide').content.replace('reviewed: 2026-10-11', 'reviewed: 2026-12-01');
    const files = [...complete.filter((f) => f.path !== 'es/guide.mdx'), { path: 'en/guide.mdx', content: future }];
    const errors = validatePages(files, dataset, today).errors.join('\n');
    expect(errors).toMatch(/reviewed date is in the future/);
    expect(errors).toMatch(/does not match folder "en"/);
  });

  it('flags TODO markers but not the Spanish word "todo"', () => {
    const files = [
      ...complete.filter((f) => !['es/guide.mdx', 'es/gear.mdx'].includes(f.path)),
      page('es', 'guide', 'Sirve sobre todo para subir de nivel.'),
      page('es', 'gear', 'TODO: completar'),
    ];
    const warnings = validatePages(files, dataset, today).warnings;
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/es\/gear\.mdx/);
  });

  it('treats drafts as unpublished', () => {
    const draft = page('es', 'gear').content.replace('status: published', 'status: draft');
    const files = [...complete.filter((f) => f.path !== 'es/gear.mdx'), { path: 'es/gear.mdx', content: draft }];
    const report = validatePages(files, dataset, today);
    expect(report.warnings.join('\n')).toMatch(/draft/);
    expect(report.errors).toContain('missing published page "gear" for locale "es"');
  });
});

describe('MDX component registry', () => {
  it('matches src/components/mdx.ts', () => {
    const source = readFileSync(new URL('../src/components/mdx.ts', import.meta.url), 'utf8');
    const registered = [...source.matchAll(/^\s{2}(?:(\w+): \w+|(\w+)),$/gm)]
      .map((m) => m[1] ?? m[2])
      .filter((name) => /^[A-Z]/.test(name!)); // lowercase keys override HTML elements
    expect([...registered].sort()).toEqual([...MDX_COMPONENTS].sort());
  });
});

import { describe, expect, it } from 'vitest';
import { checkIntegrity, dataset, picks, professions, type Dataset } from '../src/lib/data';
import { diffRecords } from '../src/lib/data-diff';
import { validatePages, type PageFile } from '../src/lib/page-rules';
import { headingSlug, primaryProfessions, professionAnchor, wowheadItemUrl } from '../src/lib/professions';
import { professionSchema } from '../src/lib/schemas';
import { LOCALES, PAGE_IDS } from '../src/i18n/routes';

function clone(): Dataset {
  return structuredClone(dataset);
}

describe('professions data', () => {
  it('has the nine primary professions and the three secondary ones', () => {
    expect(primaryProfessions(professions)).toHaveLength(9);
    expect(professions.filter((p) => p.kind === 'secondary').map((p) => p.id)).toEqual(['cooking', 'first-aid', 'fishing']);
  });

  it('recommends a pick for every goal the guide promises', () => {
    expect(picks.map((p) => p.id)).toEqual(['overall', 'leveling', 'pve', 'pvp', 'gold', 'casual']);
  });

  it('keeps the ratings out of secondary professions', () => {
    const cooking = professions.find((p) => p.id === 'cooking')!;
    const result = professionSchema.safeParse({ ...cooking, ratings: { pve: 'low', pvp: 'none', leveling: 'high', economy: 'low', overall: 'medium' } });
    expect(result.success).toBe(false);
  });

  it('requires ratings, pros, cons and a pair on primary professions', () => {
    const { pair: _pair, ...tailoring } = professions.find((p) => p.id === 'tailoring')!;
    expect(professionSchema.safeParse(tailoring).success).toBe(false);
  });

  it('rejects picks and pairs that name unknown or secondary professions', () => {
    const data = clone();
    data.picks[0]!.professions = ['tailoring', 'cooking'];
    data.picks[1]!.alternative!.professions = ['jewelcrafting'];
    data.professions[0]!.pair!.with = ['tailoring'];
    const problems = checkIntegrity(data).join('\n');
    expect(problems).toMatch(/"overall" names "cooking", a secondary profession/);
    expect(problems).toMatch(/"leveling" alternative names unknown profession "jewelcrafting"/);
    expect(problems).toMatch(/"tailoring" pairs with itself/);
  });
});

describe('profession anchors', () => {
  it('match the ids Astro gives the Markdown headings', () => {
    expect(headingSlug('Sastrería')).toBe('sastrería');
    expect(headingSlug('Primeros auxilios')).toBe('primeros-auxilios');
    expect(headingSlug('First Aid')).toBe('first-aid');
    expect(professionAnchor(professions.find((p) => p.id === 'engineering')!, 'es')).toBe('ingeniería');
  });

  it('links items to the Forever database', () => {
    expect(wowheadItemUrl(14152)).toBe('https://www.wowhead.com/forever/item=14152');
  });
});

describe('professions page rules', () => {
  function page(locale: string, pageId: string, body = ''): PageFile {
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
---
${body}
`,
    };
  }
  const others = LOCALES.flatMap((l) => PAGE_IDS.filter((id) => !(l === 'es' && id === 'professions')).map((id) => page(l, id)));
  const today = new Date('2026-10-14T00:00:00Z');

  it('needs the profession heading right above each detail block', () => {
    const body = '### Encantamiento\n\n<ProfessionDetail id="tailoring" />\n\n### Pesca\n\n<ProfessionDetail id="fishing" />';
    const errors = validatePages([...others, page('es', 'professions', body)], dataset, today).errors.join('\n');
    expect(errors).toMatch(/<ProfessionDetail id="tailoring"> needs the heading "### Sastrería"/);
    expect(errors).not.toMatch(/"fishing"> needs/);
  });

  it('requires every profession when the picks or the table link to them', () => {
    const body = '<ProfessionTable />\n\n### Sastrería\n\n<ProfessionDetail id="tailoring" />\n\n<ProfessionDetail id="nope" />';
    const errors = validatePages([...others, page('es', 'professions', body)], dataset, today).errors.join('\n');
    expect(errors).toMatch(/unknown profession "nope"/);
    expect(errors).toMatch(/has no <ProfessionDetail id="enchanting">/);
    expect(errors).not.toMatch(/has no <ProfessionDetail id="tailoring">/);
  });
});

describe('profession data diffs', () => {
  const tailoring = professions.find((p) => p.id === 'tailoring')!;

  it('treats an English advantage or a new item as a fact change', () => {
    const pros = [...tailoring.pros, { es: 'Nueva', en: 'New' }];
    const [problem] = diffRecords('professions.json', 'profession', [tailoring], [{ ...tailoring, pros }]);
    expect(problem?.message).toMatch(/pros\.en/);
    const items = tailoring.items.slice(1);
    expect(diffRecords('professions.json', 'profession', [tailoring], [{ ...tailoring, items }])[0]?.message).toMatch(/items\.facts/);
  });

  it('ignores Spanish-only wording fixes', () => {
    const pros = tailoring.pros.map((p, i) => (i === 0 ? { ...p, es: `${p.es} (corregido)` } : p));
    expect(diffRecords('professions.json', 'profession', [tailoring], [{ ...tailoring, pros }])).toEqual([]);
  });
});

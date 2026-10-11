import { describe, expect, it } from 'vitest';
import { checkIntegrity, dataset, milestonesForTree, type Dataset } from '../src/lib/data';

function clone(): Dataset {
  return structuredClone(dataset);
}

describe('shipped dataset', () => {
  it('passes every integrity rule', () => {
    expect(checkIntegrity(dataset)).toEqual([]);
  });

  it('has four milestone slots per tree', () => {
    for (const tree of ['arcane', 'fire', 'frost'] as const) {
      expect(milestonesForTree(tree).map((m) => m.points)).toEqual([11, 16, 21, 31]);
    }
  });

  it('only marks as verified what an official source backs', () => {
    const official = new Set(dataset.sources.filter((s) => s.kind === 'official').map((s) => s.id));
    for (const change of dataset.changes.filter((c) => c.status === 'verified')) {
      expect(change.sources.some((id) => official.has(id))).toBe(true);
    }
  });
});

describe('checkIntegrity', () => {
  it('reports unknown sources', () => {
    const data = clone();
    data.changes[0]!.sources = ['nope'];
    expect(checkIntegrity(data).join('\n')).toMatch(/unknown source "nope"/);
  });

  it('rejects verified claims without an official source', () => {
    const data = clone();
    data.changes[0]!.sources = ['zockify-mage'];
    expect(checkIntegrity(data).join('\n')).toMatch(/cites no official source/);
  });

  it('rejects "reported" claims that rest only on calculators', () => {
    const data = clone();
    data.facts[0]!.status = 'reported';
    data.facts[0]!.sources = ['seemeta-talents'];
    expect(checkIntegrity(data).join('\n')).toMatch(/calculator data alone/);
  });

  it('rejects duplicate ids and future-dated changelog entries', () => {
    const data = clone();
    data.sources.push({ ...data.sources[0]! });
    data.changelog[0]!.date = '2999-01-01';
    const problems = checkIntegrity(data, new Date('2026-10-11T12:00:00Z')).join('\n');
    expect(problems).toMatch(/duplicate id/);
    expect(problems).toMatch(/dated in the future/);
  });

  it('keeps milestones and changes in agreement', () => {
    const data = clone();
    const iceLance = data.changes.find((c) => c.id === 'ice-lance')!;
    iceLance.milestone = 21;
    expect(checkIntegrity(data).join('\n')).toMatch(/milestones.json disagrees/);
  });
});

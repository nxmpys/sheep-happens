import { describe, expect, it } from 'vitest';
import { buildCoverage, buildRole, coverageGaps, recommendedConflicts } from '../src/lib/build-coverage';
import { checkIntegrity, dataset } from '../src/lib/data';
import { buildSchema, type Build } from '../src/lib/schemas';

const base = dataset.builds.find((b) => b.id === 'frost-leveling-solo')!;

function build(id: string, overrides: Partial<Build>): Build {
  return { ...structuredClone(base), id, recommendedFor: [], ...overrides };
}

describe('build coverage', () => {
  const builds = [
    build('frost-30', { uses: ['leveling'], spec: 'frost', level: 30, recommendedFor: ['leveling'] }),
    build('fire-60', { uses: ['leveling', 'raid'], spec: 'fire', level: 60 }),
    build('fire-60-raid', { uses: ['raid'], spec: 'fire', level: 60, recommendedFor: ['raid'] }),
    build('ffb-60', { uses: ['pvp'], spec: 'hybrid', level: 60 }),
  ];
  const coverage = buildCoverage(builds, 60);
  const cell = (use: string, tree: string) => coverage.find((c) => c.use === use)!.cells.find((c) => c.tree === tree)!;

  it('tells ready, partial and pending trees apart for every use', () => {
    expect(coverage.map((c) => c.use)).toEqual(['leveling', 'aoe', 'dungeons', 'raid', 'pvp', 'duels']);
    expect(cell('leveling', 'fire').state).toBe('ready');
    expect(cell('leveling', 'frost').state).toBe('partial');
    expect(cell('leveling', 'arcane').state).toBe('pending');
    expect(cell('raid', 'fire').builds.map((b) => b.id)).toEqual(['fire-60-raid', 'fire-60']);
  });

  it('shows hybrid builds without counting them for a tree', () => {
    const pvp = coverage.find((c) => c.use === 'pvp')!;
    expect(pvp.hybrids.map((b) => b.id)).toEqual(['ffb-60']);
    expect(pvp.cells.every((c) => c.state === 'pending')).toBe(true);
  });

  it('lists the use × tree gaps at the target level', () => {
    const gaps = coverageGaps(builds, 60);
    expect(gaps.find((g) => g.use === 'leveling')!.trees).toEqual(['arcane', 'frost']);
    expect(gaps.find((g) => g.use === 'raid')!.trees).toEqual(['arcane', 'frost']);
    expect(gaps).toHaveLength(6);
  });

  it('labels a build recommended or viable per use', () => {
    const dual = build('dual', { uses: ['leveling', 'dungeons'], recommendedFor: ['dungeons'] });
    expect(buildRole(dual, 'dungeons')).toBe('recommended');
    expect(buildRole(dual, 'leveling')).toBe('viable');
  });
});

describe('recommended builds', () => {
  it('allows one recommended build per use and level', () => {
    const a = build('a', { level: 60, recommendedFor: ['leveling'] });
    expect(recommendedConflicts([a, build('b', { level: 30, recommendedFor: ['leveling'] })])).toEqual([]);
    expect(recommendedConflicts([a, build('c', { level: 60, recommendedFor: ['leveling'] })])).toEqual([
      '"c" and "a" are both recommended for leveling at level 60',
    ]);
  });

  it('is checked by the data integrity rules', () => {
    const data = structuredClone(dataset);
    const other = data.builds.find((b) => b.id !== base.id && b.level === base.level && b.uses.includes('leveling'))!;
    other.recommendedFor = ['leveling'];
    expect(checkIntegrity(data).join('\n')).toMatch(/both recommended for leveling at level 30/);
  });

  it('must name one of the build’s own uses', () => {
    const raw = { ...structuredClone(base), recommendedFor: ['raid'] };
    expect(buildSchema.safeParse(raw).success).toBe(false);
  });
});

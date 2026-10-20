import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacy } from '../src/lib/data';
import { legacyPoints, validateLegacyBuild } from '../src/lib/legacy';
import type { LegacyBuild } from '../src/lib/schemas';

describe('Legacy tree', () => {
  it('has seven perks per tree and every icon', () => {
    for (const tree of ['professions', 'adventure', 'resourcefulness'] as const) {
      expect(legacy.perks.filter((perk) => perk.tree === tree)).toHaveLength(7);
    }
    const missing = legacy.perks.filter((perk) => !existsSync(new URL(`../public/icons/${perk.icon}.jpg`, import.meta.url)));
    expect(missing.map((perk) => perk.icon)).toEqual([]);
  });

  it('ships builds the game allows, spending the whole cap', () => {
    for (const build of legacy.builds) {
      expect(validateLegacyBuild(build, legacy.perks, legacy.cap)).toEqual([]);
      expect(Object.values(legacyPoints(build)).reduce((a, b) => a + b, 0)).toBe(legacy.cap);
    }
  });
});

describe('validateLegacyBuild', () => {
  const build = (steps: LegacyBuild['steps']): LegacyBuild => ({ id: 'test', name: { es: 'x', en: 'x' }, situation: { es: 'x', en: 'x' }, steps, why: [{ es: 'x', en: 'x' }] });

  it('needs the tree points before a 5-point perk', () => {
    expect(validateLegacyBuild(build([['well-rested', 1], ['talented', 1]]), legacy.perks, 16)).toEqual([
      '"test": "talented" needs 5 points in adventure first',
    ]);
  });

  it('needs a rank in the required perk', () => {
    expect(validateLegacyBuild(build([['thrill-of-adventure', 5], ['talented', 1]]), legacy.perks, 16)).toEqual([
      '"test": "talented" needs a rank in "well-rested" first',
    ]);
  });

  it('caps ranks and points', () => {
    const problems = validateLegacyBuild(build([['reinforce', 5], ['gourmand', 3], ['quick-and-the-dead', 2], ['reinforce', 1], ['diplomat', 5], ['for-great-honor', 1]]), legacy.perks, 16);
    expect(problems).toContain('"test": "reinforce" has 6 ranks (max 5)');
    expect(problems).toContain('"test" spends 17 points (cap 16)');
  });
});

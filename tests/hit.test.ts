import { describe, expect, it } from 'vitest';
import { baseHitChance, formatHit, spellHit } from '../src/lib/hit';

describe('baseHitChance', () => {
  it('follows the Classic table against creatures', () => {
    expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].map((d) => baseHitChance(d))).toEqual([99, 98, 97, 96, 95, 94, 83, 72, 61]);
  });

  it('drops less steeply against players from +3', () => {
    expect([0, 1, 2, 3, 4, 5].map((d) => baseHitChance(d, 'player'))).toEqual([96, 95, 94, 87, 80, 73]);
  });

  it('clamps level differences outside the table', () => {
    expect(baseHitChance(-10)).toBe(99);
    expect(baseHitChance(9)).toBe(61);
  });
});

describe('spellHit', () => {
  it('needs 4% hit against your own level to stop missing (Forever)', () => {
    const result = spellHit({ levelDiff: 0, talentRank: 0, gearHit: 0 });
    expect(result.miss).toBe(4);
    expect(result.toCap).toBe(4);
    expect(spellHit({ levelDiff: 0, talentRank: 2, gearHit: 0 }).miss).toBe(0);
  });

  it('needs 17% hit against a raid boss', () => {
    const result = spellHit({ levelDiff: 3, talentRank: 0, gearHit: 0 });
    expect(result.hit).toBe(83);
    expect(result.toCap).toBe(17);
  });

  it('adds 2% per Precision rank and gear hit on top', () => {
    const result = spellHit({ levelDiff: 3, talentRank: 3, gearHit: 5 });
    expect(result.hit).toBe(94);
    expect(result.toCap).toBe(6);
  });

  it('never goes above 100% and reports the wasted hit', () => {
    const result = spellHit({ levelDiff: 0, talentRank: 3, gearHit: 1 });
    expect(result.hit).toBe(100);
    expect(result.miss).toBe(0);
    expect(result.wasted).toBe(3);
  });

  it('caps Precision at 3 ranks', () => {
    expect(spellHit({ levelDiff: 3, talentRank: 3, gearHit: 0 }).hit).toBe(89);
    expect(spellHit({ levelDiff: 3, talentRank: 5, gearHit: 0 }).hit).toBe(89);
    expect(spellHit({ levelDiff: 2, talentRank: 3, gearHit: 0 }).miss).toBe(0);
  });

  it('uses the player table when asked', () => {
    expect(spellHit({ levelDiff: 3, target: 'player', talentRank: 0, gearHit: 0 }).toCap).toBe(13);
  });

  it('ignores invalid input', () => {
    expect(spellHit({ levelDiff: 0, talentRank: Number.NaN, gearHit: -5 }).hit).toBe(96);
  });
});

describe('formatHit', () => {
  it('uses each locale', () => {
    expect(formatHit(83, 'es')).toBe('83 %');
    expect(formatHit(83, 'en')).toBe('83%');
  });
});

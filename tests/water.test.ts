import { describe, expect, it } from 'vitest';
import { mageWater } from '../src/lib/data';
import {
  bottlesPerCast,
  breakEvenSpellPower,
  byLoss,
  conjureYield,
  damageLoss,
  dungeonsBy,
  estimateWater,
  extraMana,
  intTrade,
  rankAtLevel,
  spellPowerBonus,
} from '../src/lib/water';

const spell = (name: string, rank: number) => mageWater.spells.find((s) => s.name === name && s.rank === rank)!;
const water = (rank: number) => mageWater.waterRanks.find((r) => r.rank === rank)!;

describe('damageLoss', () => {
  it.each([
    ['Scorch', 1, 33],
    ['Scorch', 7, 30],
    ['Fireball', 1, 7],
    ['Fireball', 12, 29],
    ['Frostbolt', 1, 5],
    ['Frostbolt', 11, 11],
    ['Pyroblast', 1, 30],
    ['Cone of Cold', 1, 6],
    ['Blizzard', 1, 4],
    ['Arcane Explosion', 1, 6],
  ])('%s rank %i loses about %i%% from the midpoints', (name, rank, expected) => {
    expect(Math.round(damageLoss(spell(name, rank)))).toBe(expected);
  });

  it('counts the DoT only for the spells marked so', () => {
    expect(spell('Pyroblast', 1).countDot).toBe(true);
    expect(spell('Fireball', 12).countDot).toBeUndefined();
  });

  it('sorts from the biggest loss', () => {
    const sorted = byLoss(mageWater.spells);
    expect(sorted[0]).toMatchObject({ name: 'Scorch', rank: 1 });
    expect(damageLoss(sorted[0]!)).toBeGreaterThan(damageLoss(sorted.at(-1)!));
  });
});

describe('extraMana and spell power', () => {
  it('turns a loss into the extra mana for the same damage', () => {
    expect(Math.round(extraMana(damageLoss(spell('Fireball', 12))))).toBe(40);
    expect(Math.round(extraMana(damageLoss(spell('Frostbolt', 11))))).toBe(13);
  });

  it('finds the spell power that closes the base gap', () => {
    expect(Math.round(breakEvenSpellPower(spell('Fireball', 12))!)).toBe(195);
    expect(Math.round(breakEvenSpellPower(spell('Frostbolt', 11))!)).toBe(74);
    expect(breakEvenSpellPower(spell('Blizzard', 1))).toBeUndefined();
  });

  it('adds spell power by the coefficient', () => {
    expect(spellPowerBonus(13, 70.6)).toBeCloseTo(9.18, 2);
  });
});

describe('conjured water', () => {
  it('grows 2 bottles a level up to 20 on ranks 1 to 6', () => {
    expect(bottlesPerCast(water(1), 4)).toBe(2);
    expect(bottlesPerCast(water(1), 13)).toBe(20);
    expect(bottlesPerCast(water(1), 60)).toBe(20);
    expect(bottlesPerCast(water(3), 25)).toBe(12);
    expect(bottlesPerCast(water(6), 59)).toBe(20);
  });

  it('gives 10 bottles with rank 7 at the level cap', () => {
    expect(bottlesPerCast(water(7), 60)).toBe(10);
  });

  it('has no bottles before the rank is learned', () => {
    expect(bottlesPerCast(water(3), 19)).toBe(0);
  });

  it('keeps every rank at the same cost and duration data', () => {
    expect(mageWater.waterRanks.map((r) => r.cost)).toEqual([60, 105, 180, 285, 420, 585, 780]);
    expect(mageWater.waterRanks.map((r) => r.seconds)).toEqual([18, 21, 24, 27, 30, 30, 30]);
  });

  it('marks exactly the ranks whose tooltip differs for review', () => {
    for (const rank of mageWater.waterRanks) {
      expect(Boolean(rank.todo)).toBe(rank.manaClassic !== rank.manaForever);
    }
  });

  it('makes the old rank the better batch right after learning a new one', () => {
    expect(conjureYield(water(2), 20).totalMana).toBe(8740);
    expect(conjureYield(water(3), 20).totalMana).toBe(1670);
    expect(conjureYield(water(3), 25).totalMana).toBeGreaterThan(conjureYield(water(2), 25).totalMana);
  });

  it('picks the highest rank known at a level', () => {
    expect(rankAtLevel(mageWater.waterRanks, 3)).toBeUndefined();
    expect(rankAtLevel(mageWater.waterRanks, 29)?.rank).toBe(3);
    expect(rankAtLevel(mageWater.waterRanks, 60)?.rank).toBe(7);
  });
});

describe('gear', () => {
  it('prices the Intellect a piece drops and when its mp5 repays it', () => {
    expect(intTrade(9, 5, 3)).toEqual({ manaLost: 60, paybackSeconds: 100 });
    expect(intTrade(6, 4, 1)).toEqual({ manaLost: 30, paybackSeconds: 150 });
    expect(intTrade(10, 0, 0)).toEqual({ manaLost: 150, paybackSeconds: undefined });
  });
});

describe('dungeonsBy', () => {
  it('counts dungeons started by each level', () => {
    expect(dungeonsBy(mageWater.dungeons, 20)).toMatchObject({ classic: 3, forever: 5 });
    expect(dungeonsBy(mageWater.dungeons, 30)).toMatchObject({ classic: 9, forever: 13 });
    expect(Math.round(dungeonsBy(mageWater.dungeons, 20).growth)).toBe(67);
    expect(Math.round(dungeonsBy(mageWater.dungeons, 30).growth)).toBe(44);
  });
});

describe('estimateWater', () => {
  const input = { level: 30, maxMana: 2000, spellCost: 100, refills: 3 };

  it('estimates casts, bottles and conjuring from the rank at that level', () => {
    expect(estimateWater(mageWater.waterRanks, input)).toMatchObject({
      castsFromFull: 20,
      bottlesPerRefill: 2,
      totalBottles: 6,
      bottlesPerCast: 2,
      conjureCasts: 3,
      conjureMana: 855,
    });
  });

  it('refills at the bottle rate', () => {
    const result = estimateWater(mageWater.waterRanks, input)!;
    expect(result.rank.rank).toBe(4);
    expect(result.secondsPerRefill).toBeCloseTo(2000 / (1345 / 27), 5);
  });

  it('returns nothing without a usable input', () => {
    expect(estimateWater(mageWater.waterRanks, { ...input, level: 2 })).toBeUndefined();
    expect(estimateWater(mageWater.waterRanks, { ...input, maxMana: 0 })).toBeUndefined();
    expect(estimateWater(mageWater.waterRanks, { ...input, spellCost: 0 })).toBeUndefined();
  });
});

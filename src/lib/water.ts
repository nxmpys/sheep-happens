/**
 * The arithmetic behind the Mage water page. Pure, so the calculator can run it
 * in the browser and the tests can check it; the numbers live in
 * src/data/mage-water.json.
 *
 * Damage comparisons use the midpoint of each range. Fireball's small DoT stays
 * out of its percentage (Pyroblast's is a large part of the spell, so it counts).
 */

export interface DamageRange {
  min: number;
  max: number;
  dot?: number | undefined;
}

export interface WaterSpell {
  name: string;
  rank: number;
  cost: number;
  classic: DamageRange;
  forever: DamageRange;
  /** Forever's share of spell power, in %. Absent when it is not known. */
  coefficient?: number | undefined;
  countDot?: boolean | undefined;
  todo?: string | undefined;
}

export interface WaterRank {
  rank: number;
  learn: number;
  /** Level at which the bottles per cast stop growing. */
  growthTo: number;
  base: number;
  perLevel: number;
  cost: number;
  seconds: number;
  requires: number;
  manaClassic: number;
  manaForever: number;
}

export const MAX_LEVEL = 60;
/** Mana per point of Intellect in Classic; assumed in Forever. */
export const MANA_PER_INT = 15;

export function midpoint({ min, max }: DamageRange): number {
  return (min + max) / 2;
}

export function spellDamage(range: DamageRange, countDot = false): number {
  return midpoint(range) + (countDot ? (range.dot ?? 0) : 0);
}

/** Share of base damage per mana lost, in %. Mana costs are the same in both games, so it is also the damage lost. */
export function damageLoss(spell: Pick<WaterSpell, 'classic' | 'forever' | 'countDot'>): number {
  const before = spellDamage(spell.classic, spell.countDot);
  return ((before - spellDamage(spell.forever, spell.countDot)) / before) * 100;
}

/** Extra mana (%) needed for the same base damage. */
export function extraMana(lossPercent: number): number {
  return (1 / (1 - lossPercent / 100) - 1) * 100;
}

/** Spell power that makes Forever's cast match Classic's base damage, or undefined with no known coefficient. */
export function breakEvenSpellPower(spell: Pick<WaterSpell, 'classic' | 'forever' | 'countDot' | 'coefficient'>): number | undefined {
  if (!spell.coefficient) return undefined;
  return (spellDamage(spell.classic, spell.countDot) - spellDamage(spell.forever, spell.countDot)) / (spell.coefficient / 100);
}

/** Damage a cast gains from spell power. */
export function spellPowerBonus(spellPower: number, coefficientPercent: number): number {
  return spellPower * (coefficientPercent / 100);
}

/** Highest loss first. */
export function byLoss<T extends Pick<WaterSpell, 'classic' | 'forever' | 'countDot'>>(spells: readonly T[]): T[] {
  return [...spells].sort((a, b) => damageLoss(b) - damageLoss(a));
}

/** Bottles a cast creates at a level: the spell data's base, plus its growth up to `growthTo`. */
export function bottlesPerCast(rank: Pick<WaterRank, 'learn' | 'growthTo' | 'base' | 'perLevel'>, level: number): number {
  const levels = Math.min(level, rank.growthTo) - rank.learn;
  return levels < 0 ? 0 : rank.base + levels * rank.perLevel;
}

/** The highest rank known at a level, or undefined before the first one. */
export function rankAtLevel<T extends Pick<WaterRank, 'learn'>>(ranks: readonly T[], level: number): T | undefined {
  return ranks.filter((rank) => rank.learn <= level).at(-1);
}

/** Mana for mana: what one cast of a rank puts in the group's bags at a level. */
export function conjureYield(rank: WaterRank, level: number) {
  const bottles = bottlesPerCast(rank, level);
  return {
    bottles,
    totalMana: bottles * rank.manaForever,
    manaPerSecond: rank.manaForever / rank.seconds,
  };
}

/** Mana a player loses when a piece of gear drops Intellect, and how long its mp5 takes to give it back. */
export function intTrade(classicInt: number, foreverInt: number, mp5: number) {
  const manaLost = Math.max(0, classicInt - foreverInt) * MANA_PER_INT;
  return { manaLost, paybackSeconds: mp5 > 0 ? (manaLost / mp5) * 5 : undefined };
}

export interface DungeonStart {
  start: number;
  isNew?: boolean | undefined;
}

/** How many dungeons have started by a level, in each game. */
export function dungeonsBy(list: readonly DungeonStart[], level: number) {
  const open = list.filter((dungeon) => dungeon.start <= level);
  const classic = open.filter((dungeon) => !dungeon.isNew).length;
  const forever = open.length;
  return { level, classic, forever, growth: classic === 0 ? 0 : ((forever - classic) / classic) * 100 };
}

export interface WaterEstimateInput {
  level: number;
  maxMana: number;
  spellCost: number;
  refills: number;
}

/**
 * Calculator estimate: casts from a full pool, and the water to refill an empty
 * pool. Ignores regeneration, crits, Clearcasting and damage taken.
 */
export function estimateWater(ranks: readonly WaterRank[], input: WaterEstimateInput) {
  const rank = rankAtLevel(ranks, input.level);
  if (!rank || input.maxMana <= 0 || input.spellCost <= 0) return undefined;
  const refills = Math.max(1, Math.round(input.refills));
  const bottlesPerRefill = Math.ceil(input.maxMana / rank.manaForever);
  const totalBottles = bottlesPerRefill * refills;
  const perCast = bottlesPerCast(rank, input.level);
  const casts = Math.ceil(totalBottles / perCast);
  return {
    rank,
    castsFromFull: Math.floor(input.maxMana / input.spellCost),
    bottlesPerRefill,
    secondsPerRefill: input.maxMana / (rank.manaForever / rank.seconds),
    totalBottles,
    bottlesPerCast: perCast,
    conjureCasts: casts,
    conjureMana: casts * rank.cost,
  };
}

/** A number with the locale's decimal mark and `digits` decimals. */
export function formatNumber(value: number, locale: 'es' | 'en', digits = 0): string {
  return value.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** "33 %" in Spanish, "33%" in English. */
export function formatPercent(value: number, locale: 'es' | 'en', digits = 0): string {
  return `${formatNumber(value, locale, digits)}${locale === 'es' ? ' %' : '%'}`;
}

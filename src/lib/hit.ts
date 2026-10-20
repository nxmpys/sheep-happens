/**
 * Spell hit chance against creatures (PvE) and players (PvP).
 *
 * Base tables from WoW Classic: 96% against a target of your level, 1% less
 * per level up to +2, then 11% less per level against creatures (83% at +3,
 * the level of raid bosses for a level 60) or 7% less against players (87% at
 * +3). Lower-level targets add 1% per level.
 *
 * The cap is Forever's, not Classic's: in Classic a spell always kept a 1%
 * chance to miss (99% cap); in Forever players report that 4% hit removes
 * misses against your level and 17% against a raid boss, so hit reaches 100%
 * (Method and a beta forum thread, October 2026; Blizzard has not said it).
 *
 * Forever keeps spell hit talents: Arcane Focus (Arcane) and Elemental
 * Precision (Fire and Frost), +1% per rank, 5 ranks each (Wowhead Forever beta
 * data). Hit from gear adds on top.
 */

export type HitTarget = 'creature' | 'player';

export const MIN_LEVEL_DIFF = -3;
export const MAX_LEVEL_DIFF = 5;
export const MAX_TALENT_RANK = 5;
export const TALENT_HIT_PER_RANK = 1;
export const HIT_CAP = 100;

/** Drop in hit chance per level from +3 on. */
const STEEP_DROP: Record<HitTarget, number> = { creature: 11, player: 7 };

/** Base chance (%) to hit a target `diff` levels above you (negative: below). */
export function baseHitChance(diff: number, target: HitTarget = 'creature'): number {
  const d = Math.min(MAX_LEVEL_DIFF, Math.max(MIN_LEVEL_DIFF, Math.round(diff)));
  if (d <= 2) return 96 - d;
  return 94 - (d - 2) * STEEP_DROP[target];
}

export interface HitInput {
  /** Target level minus your level. */
  levelDiff: number;
  target?: HitTarget;
  /** Arcane Focus or Elemental Precision ranks, depending on the spell's school. */
  talentRank: number;
  /** Spell hit (%) from gear and enchants. */
  gearHit: number;
}

export interface HitResult {
  base: number;
  /** Chance to hit (%), capped at 100. */
  hit: number;
  miss: number;
  /** Extra hit (%) still needed to reach the cap; 0 when capped. */
  toCap: number;
  /** Hit (%) above the cap that does nothing. */
  wasted: number;
}

const clamp = (value: number, min: number, max: number) => (Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min);
const tidy = (value: number) => Math.round(value * 100) / 100;

export function spellHit(input: HitInput): HitResult {
  const base = baseHitChance(input.levelDiff, input.target ?? 'creature');
  const talent = Math.round(clamp(input.talentRank, 0, MAX_TALENT_RANK)) * TALENT_HIT_PER_RANK;
  const gear = clamp(input.gearHit, 0, 100);
  const raw = base + talent + gear;
  const hit = Math.min(HIT_CAP, raw);
  return {
    base,
    hit: tidy(hit),
    miss: tidy(100 - hit),
    toCap: tidy(Math.max(0, HIT_CAP - raw)),
    wasted: tidy(Math.max(0, raw - HIT_CAP)),
  };
}

/** Formats 83 as "83 %" (es) or "83%" (en). */
export function formatHit(value: number, locale: 'es' | 'en'): string {
  const number = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', { maximumFractionDigits: 1 }).format(value);
  return locale === 'es' ? `${number} %` : `${number}%`;
}

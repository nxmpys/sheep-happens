/**
 * Critical strike multiplier for Fire, Frost and Frostfire spells.
 *
 * Rank values come from WoW Classic (Ice Shards: +20% crit damage bonus per
 * rank; Ignite: 8% of the crit per rank over 4 s). Blizzard's Forever deep dive
 * confirms the end points: Frostfire Bolt with both talents maxed crits for
 * 200% plus 40% of that as Ignite = 280%. Intermediate ranks are assumed to
 * scale linearly as in Classic until Forever data says otherwise.
 */

export type CritSchool = 'fire' | 'frost' | 'frostfire';

export const MAX_RANK = 5;
/** A Classic spell critical strike deals 150% damage (a +50% bonus). */
export const BASE_CRIT_BONUS = 0.5;
export const ICE_SHARDS_PER_RANK = 0.2;
export const IGNITE_PER_RANK = 0.08;

export interface CritInput {
  school: CritSchool;
  iceShards: number;
  ignite: number;
}

export interface CritResult {
  /** Damage of the critical hit itself, as a multiple of a normal hit. */
  hit: number;
  /** Extra Ignite damage over 4 s, as a multiple of a normal hit. */
  ignite: number;
  /** hit + ignite. */
  total: number;
  /** Which talents actually apply to this school. */
  usesIceShards: boolean;
  usesIgnite: boolean;
}

function clampRank(rank: number): number {
  if (!Number.isFinite(rank)) return 0;
  return Math.min(MAX_RANK, Math.max(0, Math.round(rank)));
}

/** Rounds away floating point noise (0.1 + 0.2 style) to 4 decimals. */
function tidy(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

export function critMultiplier(input: CritInput): CritResult {
  const usesIceShards = input.school === 'frost' || input.school === 'frostfire';
  const usesIgnite = input.school === 'fire' || input.school === 'frostfire';
  const iceShards = usesIceShards ? clampRank(input.iceShards) : 0;
  const ignite = usesIgnite ? clampRank(input.ignite) : 0;

  const hit = 1 + BASE_CRIT_BONUS * (1 + iceShards * ICE_SHARDS_PER_RANK);
  const igniteDamage = hit * ignite * IGNITE_PER_RANK;
  return {
    hit: tidy(hit),
    ignite: tidy(igniteDamage),
    total: tidy(hit + igniteDamage),
    usesIceShards,
    usesIgnite,
  };
}

/** Formats 2.8 as "280 %" (es) or "280%" (en). */
export function formatPercent(multiplier: number, locale: 'es' | 'en'): string {
  const value = Math.round(multiplier * 1000) / 10;
  const number = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', { maximumFractionDigits: 1 }).format(value);
  return locale === 'es' ? `${number} %` : `${number}%`;
}

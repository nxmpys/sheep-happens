/**
 * Small helpers for the professions page. Pure, so they are unit tested.
 */
import type { Locale } from '../i18n/routes';
import type { Profession } from './schemas';

/**
 * The id Astro gives a Markdown heading (github-slugger): lowercase, punctuation
 * removed, each space turned into a hyphen. Accented letters are kept.
 * Each profession's card (ProfessionDetail) has a heading with this slug, and
 * the picks and the comparison table link to it.
 */
export function headingSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

export function professionAnchor(profession: Pick<Profession, 'name'>, locale: Locale): string {
  return headingSlug(profession.name[locale]);
}

/** The in-game icon of each profession (public/icons/<icon>.jpg). */
export const PROFESSION_ICONS: Readonly<Record<string, string>> = {
  tailoring: 'trade_tailoring',
  enchanting: 'trade_engraving',
  engineering: 'trade_engineering',
  alchemy: 'trade_alchemy',
  herbalism: 'trade_herbalism',
  mining: 'trade_mining',
  skinning: 'inv_misc_pelt_wolf_01',
  leatherworking: 'trade_leatherworking',
  blacksmithing: 'trade_blacksmithing',
  cooking: 'inv_misc_food_15',
  'first-aid': 'spell_holy_sealofsacrifice',
  fishing: 'trade_fishing',
};

/** Item page in Wowhead's Forever database. */
export function wowheadItemUrl(id: number): string {
  return `https://www.wowhead.com/forever/item=${id}`;
}

/** Professions that take one of the two primary slots, in data order. */
export function primaryProfessions<T extends Pick<Profession, 'kind'>>(list: readonly T[]): T[] {
  return list.filter((p) => p.kind !== 'secondary');
}

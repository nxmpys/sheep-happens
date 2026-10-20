/**
 * Game icons, served from public/icons/<name>.jpg (56 × 56, copied from the
 * Wowhead icon CDN so pages load no third-party images and the CSP stays
 * 'self'). Names are the client's icon file names, e.g. "spell_frost_frostbolt02".
 * scripts/check-output.ts fails the build if a page points to a missing icon.
 */
import type { SpecTree } from './schemas';

export function iconPath(icon: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return `${base}icons/${icon}.jpg`;
}

/** The icon of each talent tree, as in the game's talent window tabs. */
export const TREE_ICONS: Record<SpecTree, string> = {
  arcane: 'spell_holy_magicalsentry',
  fire: 'spell_fire_firebolt02',
  frost: 'spell_frost_frostbolt02',
};

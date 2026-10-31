/**
 * What each menu entry's dropdown lists: the same pages its hub shows as cards,
 * plus the sections of the hub page worth reaching directly (calculators,
 * glossary). Builds lists the contents that have builds; those pages are
 * generated from builds.json, so it gets them as an argument.
 */
import { pathFor, ROUTES, type Locale, type NavGroup, type PageId } from '../i18n/routes';
import { NAV_LABELS } from '../i18n/ui';
import { USE_TITLES } from '../i18n/builds';
import { contentPath } from './build-routes';
import type { BuildUse, SpecTree } from './schemas';

export interface MenuLink {
  label: string;
  url: string;
  /** The page it leads to, to mark it as current. Absent on sections of a page. */
  page?: PageId;
  /** Talent tree the page belongs to: these links show as a list hanging from Specializations. */
  tree?: SpecTree;
}

export interface MenuBlock {
  heading?: string;
  links: MenuLink[];
}

/** Pages the dropdown names differently from their breadcrumb label. */
const MENU_LABELS: Partial<Record<PageId, Record<Locale, string>>> = {
  talents: { es: 'Especializaciones', en: 'Specializations' },
};

export function menuBlocks(group: NavGroup, locale: Locale, opts: { base?: string; contents?: readonly BuildUse[] } = {}): MenuBlock[] {
  const base = opts.base ?? '/';
  const items: MenuLink[] = (group.items ?? []).map((page) => {
    const tree = ROUTES[page].spec;
    return { label: MENU_LABELS[page]?.[locale] ?? NAV_LABELS[locale][page], url: pathFor(page, locale, { base }), page, ...(tree ? { tree } : {}) };
  });
  const sections: MenuLink[] = (group.sections ?? []).map((section) => ({
    label: section.label[locale],
    url: pathFor(group.page, locale, { base, hash: section.hash[locale] }),
  }));

  switch (group.key) {
    case 'learn': {
      // In reading order: the sections of Learn itself, then its pages; the three
      // trees hang from Specializations as a list of their own, and the glossary goes last.
      const firstTree = items.findIndex((link) => link.tree);
      return [
        { links: [...sections.slice(0, -1), ...items.slice(0, firstTree)] },
        { links: items.filter((link) => link.tree) },
        { links: [...items.slice(firstTree).filter((link) => !link.tree), ...sections.slice(-1)] },
      ];
    }
    case 'builds':
      return [{ links: (opts.contents ?? []).map((use) => ({ label: USE_TITLES[locale][use], url: contentPath(use, locale, { base }) })) }];
    case 'tools':
      // In the order its hub page shows them; the addon apart, under its own heading.
      return [{ links: [...sections, ...items.filter((link) => link.page !== 'addons')] }, { heading: 'Addons', links: items.filter((link) => link.page === 'addons') }];
    default:
      return [{ links: [...items, ...sections] }];
  }
}

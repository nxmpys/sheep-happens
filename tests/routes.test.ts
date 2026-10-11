import { describe, expect, it } from 'vitest';
import {
  LEARNING_PATH,
  LOCALES,
  PAGE_IDS,
  ROUTES,
  breadcrumbTrail,
  neighbours,
  pageIdForSlug,
  pathFor,
} from '../src/i18n/routes';
import { NAV_LABELS, t } from '../src/i18n/ui';

describe('pathFor', () => {
  it('builds localized paths with a trailing slash', () => {
    expect(pathFor('home', 'es')).toBe('/es/');
    expect(pathFor('talents-frost', 'es')).toBe('/es/talentos/escarcha/');
    expect(pathFor('talents-frost', 'en')).toBe('/en/talents/frost/');
  });

  it('respects a base path and hash', () => {
    expect(pathFor('changes', 'en', { base: '/sheep', hash: 'filters' })).toBe('/sheep/en/changes/#filters');
  });
});

describe('route registry', () => {
  it('has unique slugs per locale', () => {
    for (const locale of LOCALES) {
      const slugs = PAGE_IDS.map((id) => ROUTES[id].slug[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('resolves every slug back to its page', () => {
    for (const locale of LOCALES) {
      for (const id of PAGE_IDS) {
        expect(pageIdForSlug(locale, ROUTES[id].slug[locale])).toBe(id);
      }
    }
  });

  it('never puts a version or season in a slug', () => {
    for (const id of PAGE_IDS) {
      for (const locale of LOCALES) expect(ROUTES[id].slug[locale]).not.toMatch(/\d|beta|season|temporada/);
    }
  });

  it('builds breadcrumbs from the root', () => {
    expect(breadcrumbTrail('talents-fire')).toEqual(['home', 'talents', 'talents-fire']);
  });

  it('links the learning path both ways', () => {
    expect(neighbours(LEARNING_PATH[0]!)).toEqual({ next: LEARNING_PATH[1] });
    expect(neighbours('talents-fire')).toEqual({ prev: 'talents-arcane', next: 'talents-frost' });
    expect(neighbours('sources')).toEqual({});
  });
});

describe('ui strings', () => {
  it('labels every page in every locale', () => {
    for (const locale of LOCALES) {
      for (const id of PAGE_IDS) expect(NAV_LABELS[locale][id]).toBeTruthy();
    }
  });

  it('fills placeholders and keeps unknown ones', () => {
    expect(t('es', 'changes.count', { shown: 3, total: 41 })).toBe('Mostrando 3 de 41 cambios');
    expect(t('en', 'changes.count', { shown: 3 })).toBe('Showing 3 of {total} changes');
  });
});

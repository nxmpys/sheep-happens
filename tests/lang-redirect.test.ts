import { describe, expect, it } from 'vitest';
import { negotiateLocale, rootLocale, savedLocale } from '../src/lib/lang-redirect';

describe('root language', () => {
  it('prefers the saved choice', () => {
    expect(savedLocale('theme=dark; sh-lang=en')).toBe('en');
    expect(savedLocale('sh-lang=fr')).toBeUndefined();
    expect(rootLocale('sh-lang=es', 'en-GB,en;q=0.9')).toBe('es');
  });

  it('follows Accept-Language with q-values', () => {
    expect(negotiateLocale('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
    expect(negotiateLocale('en-US,en;q=0.9,es;q=0.8')).toBe('en');
    expect(negotiateLocale('fr-FR,es;q=0.5,en;q=0.7')).toBe('en');
    expect(negotiateLocale('fr-FR,de;q=0.8')).toBe('en');
    expect(negotiateLocale('es;q=0, en')).toBe('en');
  });

  it('gives crawlers without a language the root page', () => {
    expect(rootLocale(null, null)).toBeUndefined();
    expect(rootLocale('', '')).toBeUndefined();
  });
});

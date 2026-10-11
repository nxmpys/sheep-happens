import { describe, expect, it } from 'vitest';
import { collectIds, collectLinks, resolveInternal } from '../src/lib/links';

describe('collectLinks / collectIds', () => {
  it('extracts and decodes attribute values', () => {
    const html = '<a href="/es/cambios/?tree=frost&amp;kind=new">x</a><img src="/a.png"><h2 id="fuentes">F</h2>';
    expect(collectLinks(html)).toEqual(['/es/cambios/?tree=frost&kind=new', '/a.png']);
    expect(collectIds(html).has('fuentes')).toBe(true);
  });
});

describe('resolveInternal', () => {
  it('resolves absolute, relative and same-page links', () => {
    expect(resolveInternal('/es/guia/#maná', '/es/index.html')).toEqual({ path: '/es/guia/', hash: 'maná' });
    expect(resolveInternal('../cambios/', '/es/guia/index.html')).toEqual({ path: '/es/cambios/', hash: undefined });
    expect(resolveInternal('#top', '/en/guide/index.html')).toEqual({ path: '/en/guide/index.html', hash: 'top' });
  });

  it('strips a base path and ignores links outside it', () => {
    expect(resolveInternal('/sheep/en/tools/', '/en/index.html', '/sheep/')).toEqual({ path: '/en/tools/', hash: undefined });
    expect(resolveInternal('/elsewhere/', '/en/index.html', '/sheep/')).toBeUndefined();
  });
});

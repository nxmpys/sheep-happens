import { describe, expect, it } from 'vitest';
import { dedupeRefs } from '../src/lib/ref-list';
import { firstSentence } from '../src/lib/text';

describe('dedupeRefs', () => {
  it('drops unresolved refs and keeps one chip per visible name', () => {
    const refs = dedupeRefs([
      { label: 'Cono de frío', href: '/es/cambios/#change-cone-of-cold' },
      undefined,
      { label: 'Cono de Frío', href: '/es/guia/#role-control' },
      { label: 'Humano', href: '/es/razas/#race-human' },
    ]);
    expect(refs).toEqual([
      { label: 'Cono de frío', href: '/es/cambios/#change-cone-of-cold' },
      { label: 'Humano', href: '/es/razas/#race-human' },
    ]);
  });
});

describe('firstSentence', () => {
  it('cuts at the first full stop or colon, not at decimals', () => {
    expect(firstSentence('Tienes que estar quieto 0,5 s. Afecta a todas las clases.')).toBe('Tienes que estar quieto 0,5 s.');
    expect(firstSentence('Casts 1.5 sec faster. More text.')).toBe('Casts 1.5 sec faster.');
    expect(firstSentence('Incorporamos la build: fichas nuevas y más.')).toBe('Incorporamos la build.');
    expect(firstSentence('Sin punto final')).toBe('Sin punto final');
  });
});

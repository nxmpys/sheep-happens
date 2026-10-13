import { describe, expect, it } from 'vitest';
import { abilities, changes, milestones, talents } from '../src/lib/data';
import { buildSpellIndex, findSpell } from '../src/lib/spells';

const es = buildSpellIndex({ abilities, changes, talents, milestones }, 'es');
const en = buildSpellIndex({ abilities, changes, talents, milestones }, 'en');

describe('spell tooltips', () => {
  it('finds spells by their Spanish or English name, ignoring case and accents', () => {
    expect(findSpell(es, 'Lanza de hielo')?.key).toBe('change-ice-lance');
    expect(findSpell(es, 'ice lance')?.key).toBe('change-ice-lance');
    expect(findSpell(es, 'Descarga de Escarcha')?.key).toBe('ability-frostbolt');
    expect(findSpell(es, 'Piroexplosion')?.key).toBe('talent-pyroblast');
  });

  it('ignores bold text that is not a spell', () => {
    expect(findSpell(es, 'daño a distancia')).toBeUndefined();
    expect(findSpell(es, 'Oficial')).toBeUndefined();
  });

  it('merges a base ability with its own Forever change', () => {
    const missiles = findSpell(es, 'Misiles Arcanos')!;
    expect(missiles.key).toBe('ability-arcane-missiles');
    expect(missiles.changes.map((c) => c.id)).toContain('arcane-missiles');
    expect(missiles.changeAnchor).toBe('change-arcane-missiles');
    expect(es.entries['change-arcane-missiles']).toBeUndefined();
  });

  it('shows the Spanish name with the English hint on Spanish pages only', () => {
    expect(findSpell(es, 'Ice Block')).toMatchObject({ name: 'Bloqueo de hielo', english: 'Ice Block' });
    expect(findSpell(en, 'Ice Block')).toMatchObject({ name: 'Ice Block' });
    expect(findSpell(en, 'Ice Block')?.english).toBeUndefined();
  });

  it('marks Classic learning levels and talent rows', () => {
    expect(findSpell(es, 'Contrahechizo')?.facts).toContain('Nivel 24 (Classic)');
    expect(findSpell(es, 'Bloqueo de hielo')?.facts).toEqual(['Talento de Escarcha', 'Fila 4', 'Decisivo de 16 puntos']);
  });

  it('covers talents Forever did not change, with their milestone slot', () => {
    expect(findSpell(en, 'Ice Barrier')).toMatchObject({ status: 'classic', school: 'frost' });
    expect(findSpell(en, 'Presence of Mind')?.facts).toEqual(['Arcane talent', 'Row 5', '21-point milestone']);
  });
});

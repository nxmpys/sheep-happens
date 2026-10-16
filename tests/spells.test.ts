import { describe, expect, it } from 'vitest';
import { abilities, changes, milestones, spellText, talents } from '../src/lib/data';
import { buildSpellIndex, findSpell } from '../src/lib/spells';
import { fillRankValues, looksEnglish, parseWowheadTooltip, tidyDescription } from '../src/lib/spell-text';

const es = buildSpellIndex({ abilities, changes, talents, milestones, spellText }, 'es');
const en = buildSpellIndex({ abilities, changes, talents, milestones, spellText }, 'en');

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
    expect(missiles.href).toBe('/es/cambios/#change-arcane-missiles');
    expect(missiles.more).toBe('changes');
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
    expect(findSpell(es, 'Dedos de Escarcha')?.facts).toContain('2 rangos');
  });

  it('covers talents Forever did not change, with their milestone slot', () => {
    expect(findSpell(en, 'Ice Barrier')).toMatchObject({ school: 'frost', more: 'talents', href: '/en/talents/frost/' });
    expect(findSpell(en, 'Presence of Mind')?.facts).toEqual(['Arcane talent', 'Row 5', '21-point milestone']);
  });

  it('shows the in-game text, not our notes or the Forever change', () => {
    const fingers = findSpell(es, 'Dedos de Escarcha')!;
    expect(fingers.game?.text).toMatch(/^Da a tus efectos de enfriamiento/);
    expect(fingers.summary).toBeUndefined();
    expect(fingers.href).toBe('/es/cambios/#change-fingers-of-frost');
    const frostbolt = findSpell(en, 'Frostbolt')!;
    expect(frostbolt.game?.meta).toEqual(['25 Mana', '30 yd range', '1.5 sec cast']);
    expect(frostbolt.more).toBe('guide');
  });

  it('gives every talent and ability with a spell id its in-game text', () => {
    const missing = Object.values(en.entries).filter((entry) => !entry.game && !entry.facts.includes('Forever system'));
    expect(missing.map((entry) => entry.key)).toEqual(['ability-teleport-portal']);
    expect(findSpell(en, 'Improved Frostbolt')?.game?.text).toContain('by 0.1/0.2/0.3/0.4/0.5 sec');
  });

  it('falls back to our description when the game has no text', () => {
    const ranks = findSpell(en, 'Spell ranks')!;
    expect(ranks.game).toBeUndefined();
    expect(ranks.summary).toBeTruthy();
    expect(ranks.status).toBeDefined();
  });
});

describe('in-game tooltip text', () => {
  it('reads cost, range, cast time and description from a Wowhead tooltip', () => {
    const html =
      '<table><tr><td><table width="100%"><tr><td><a class="whtt-name" href="/forever/spell=116"><b class="whtt-name">Frostbolt</b></a></td>' +
      '<th><b class="q0"><br>Level <!--lvl-->60</b></th></tr></table><table width="100%"><tr><td>25 Mana</td><th>30 yd range</th></tr></table>' +
      '1.5 sec cast<div class="wowhead-tooltip-requirements">Requires Mage</div><span class="wowhead-tooltip-requirements">Requires level 4</span><br /></td></tr></table>' +
      '<table><tr><td><div class="q">Launches a bolt of frost, causing (18.8 * 1) to (20.8 * 1) &nbsp;Frost damage.</div></td></tr></table>';
    expect(parseWowheadTooltip(html)).toEqual({
      meta: ['25 Mana', '30 yd range', '1.5 sec cast'],
      text: 'Launches a bolt of frost, causing 19 to 21 Frost damage.',
    });
  });

  it('fills in rank values that the tooltip rounds down to 0', () => {
    expect(fillRankValues('a 0% chance, up to 10 times', ['20', '40'])).toBe('a 20/40% chance, up to 10 times');
    expect(fillRankValues('by 0 sec.', ['0.1', '0.2'])).toBe('by 0.1/0.2 sec.');
    expect(fillRankValues('lasts 10 sec.', ['1'])).toBe('lasts 10 sec.');
  });

  it('drops talent-dependent notes in brackets', () => {
    expect(tidyDescription('Absorbs 162 Fire damage [Improved Fire Ward: and reflects 0%]. Lasts 30 sec.')).toBe(
      'Absorbs 162 Fire damage. Lasts 30 sec.',
    );
  });

  it('spots Spanish texts that the game has not translated yet', () => {
    expect(looksEnglish('Targets in a cone in front of the caster take 96 to 106 Frost damage')).toBe(true);
    expect(looksEnglish('Transforma al enemigo en una oveja y lo obliga a deambular durante 20 s.')).toBe(false);
  });
});

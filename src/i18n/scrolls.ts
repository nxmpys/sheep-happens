/**
 * Labels for the scrolls page (Comprehension), kept apart from ui.ts because only that page uses them.
 */
import type { Locale } from './routes';

const es = {
  'flow.label': 'Cómo se lee un pergamino, en 4 pasos',
  'flow.step': 'Paso {n}',
  'book.label': 'Esquema del libro de hechizos con la pestaña General y Comprender pergamino resaltados',
  'book.title': 'Libro de hechizos',
  'book.tab.general': 'General',
  'book.tab.arcane': 'Arcano',
  'book.tab.fire': 'Fuego',
  'book.tab.frost': 'Escarcha',
  'book.spell': 'Comprender pergamino',
  'book.note': 'Esquema, no es una captura del juego.',
  'names.label': 'Los nombres de la mecánica',
  'names.spell': 'En el libro de hechizos',
  'names.spell.desc': 'Comprender pergamino (Comprehend Scroll). En el cliente en español se lee «Entender pergamino».',
  'names.skill': 'La habilidad',
  'names.skill.desc': 'Comprensión (Comprehension), un oficio menor.',
  'names.prof': 'En la ventana de profesiones',
  'names.prof.desc': 'Investigación del Mago (Mage Research): la misma habilidad, con Investigar y Estudiar para las bibliotecas.',
  'yes.title': 'Sí',
  'no.title': 'No',
  'yes.label': 'Lo que sí',
  'no.label': 'Lo que no',
  'tiers.label': 'Habilidad de Comprensión que pide cada tipo de pergamino',
  'tiers.axis': 'Habilidad de Comprensión',
  'tiers.requires': 'Pide {n}',
  'tiers.grey': 'da puntos hasta {n}',
  'tiers.max': 'Máximo',
  'tips.label': 'Consejos para el leveo',
  'unknown.label': 'Lo que aún no se sabe',
} as const;

export type ScrollUiKey = keyof typeof es;

const en: Record<ScrollUiKey, string> = {
  'flow.label': 'How to read a scroll, in 4 steps',
  'flow.step': 'Step {n}',
  'book.label': 'Spellbook diagram with the General tab and Comprehend Scroll highlighted',
  'book.title': 'Spellbook',
  'book.tab.general': 'General',
  'book.tab.arcane': 'Arcane',
  'book.tab.fire': 'Fire',
  'book.tab.frost': 'Frost',
  'book.spell': 'Comprehend Scroll',
  'book.note': 'A diagram, not an in-game capture.',
  'names.label': 'The names of the mechanic',
  'names.spell': 'In the spellbook',
  'names.spell.desc': 'Comprehend Scroll.',
  'names.skill': 'The skill',
  'names.skill.desc': 'Comprehension, a minor tradeskill.',
  'names.prof': 'In the professions window',
  'names.prof.desc': 'Mage Research: the same skill, with Research and Study for libraries.',
  'yes.title': 'Yes',
  'no.title': 'No',
  'yes.label': 'Do',
  'no.label': "Don't",
  'tiers.label': 'Comprehension skill each kind of scroll asks for',
  'tiers.axis': 'Comprehension skill',
  'tiers.requires': 'Needs {n}',
  'tiers.grey': 'gives points up to {n}',
  'tiers.max': 'Cap',
  'tips.label': 'Leveling tips',
  'unknown.label': 'Still unknown',
};

const STRINGS: Record<Locale, Record<ScrollUiKey, string>> = { es, en };

export function ts(locale: Locale, key: ScrollUiKey, vars: Record<string, string | number> = {}): string {
  return STRINGS[locale][key].replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

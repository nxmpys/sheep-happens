/**
 * Labels for the addons page, kept apart from ui.ts because only that page uses them.
 */
import type { Locale } from './routes';
import type { Addon } from '../lib/schemas';

export const SPEC_LABELS: Record<Locale, Record<Addon['procs'][number]['spec'], string>> = {
  es: { arcane: 'Arcano', fire: 'Fuego', frost: 'Escarcha' },
  en: { arcane: 'Arcane', fire: 'Fire', frost: 'Frost' },
};

const es = {
  'link.download': 'Ver {name} en {host}',
  'newTab': '(se abre en una pestaña nueva)',
  'procs.caption': 'Procs que avisa {name}',
  'procs.on': 'Activado de inicio',
  'gallery.title': 'Capturas del juego',
  'gallery.open': 'Ampliar imagen',
  'gallery.close': 'Cerrar imagen',
  'install.steps': 'Pasos',
  'install.commands': 'Comandos',
  'install.command': 'Comando',
  'install.what': 'Qué hace',
} as const;

export type AddonUiKey = keyof typeof es;

const en: Record<AddonUiKey, string> = {
  'link.download': '{name} on {host}',
  'newTab': '(opens in a new tab)',
  'procs.caption': 'Procs {name} alerts you to',
  'procs.on': 'On by default',
  'gallery.title': 'In-game captures',
  'gallery.open': 'Enlarge image',
  'gallery.close': 'Close image',
  'install.steps': 'Steps',
  'install.commands': 'Commands',
  'install.command': 'Command',
  'install.what': 'What it does',
};

const STRINGS: Record<Locale, Record<AddonUiKey, string>> = { es, en };

export function ta(locale: Locale, key: AddonUiKey, vars: Record<string, string> = {}): string {
  return STRINGS[locale][key].replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? `{${name}}`);
}

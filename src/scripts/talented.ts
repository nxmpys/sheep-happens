/**
 * The reader's "I have Talented 5/5" preference (Legacy perk), shared by every
 * point-order table and the level view. Off by default: a first character at
 * launch does not have it. Stored in localStorage and mirrored on
 * <html data-talented>, which the tables' CSS reads.
 */
const KEY = 'sh-talented';
export const TALENTED_EVENT = 'sh:talented';

export function readTalented(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function applyTalented(on: boolean): void {
  document.documentElement.toggleAttribute('data-talented', on);
  for (const input of document.querySelectorAll<HTMLInputElement>('input[data-talented-toggle]')) input.checked = on;
  document.dispatchEvent(new CustomEvent(TALENTED_EVENT, { detail: on }));
}

export function saveTalented(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch {}
  applyTalented(on);
}

/** Wires every switch on the page and keeps tabs in sync. Safe to call more than once. */
export function initTalented(): void {
  for (const label of document.querySelectorAll<HTMLElement>('[data-talented-switch]')) label.hidden = false;
  for (const input of document.querySelectorAll<HTMLInputElement>('input[data-talented-toggle]')) {
    if (input.dataset.wired) continue;
    input.dataset.wired = '1';
    input.addEventListener('change', () => saveTalented(input.checked));
  }
  applyTalented(readTalented());
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) applyTalented(event.newValue === '1');
  });
}

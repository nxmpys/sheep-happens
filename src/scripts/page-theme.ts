/** Whether the page is showing dark right now, whichever way the theme was chosen. */
export function isDarkPage(): boolean {
  const [r = 0, g = 0, b = 0] = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
  return r * 0.3 + g * 0.6 + b * 0.1 < 128;
}

/** Runs when the theme button or the system's theme changes the page's colours. */
export function onThemeChange(run: () => void) {
  new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', run);
}

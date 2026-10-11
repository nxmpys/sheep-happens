let timer: number | undefined;

/** Shows a short message in the global live region (see layout/Toast.astro). */
export function showToast(message: string) {
  const region = document.getElementById('toast');
  if (!region) return;
  region.textContent = message;
  region.dataset.visible = 'true';
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    region.dataset.visible = 'false';
  }, 2600);
}

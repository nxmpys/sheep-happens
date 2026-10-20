/**
 * Behaviour for src/styles/motion.css («Arcano vivo»): the card glow follows
 * the pointer, primary buttons ripple from the click, and section titles draw
 * their rune stroke when they come into view. Nothing runs with «reduce motion».
 */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // Card glow: one listener for the whole page.
  let frame = 0;
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const card = (event.target as Element | null)?.closest<HTMLElement>('.has-glow');
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - box.left}px`);
      card.style.setProperty('--y', `${event.clientY - box.top}px`);
    });
  });

  // Ripple from the exact point of the click.
  document.addEventListener('pointerdown', (event) => {
    const button = (event.target as Element | null)?.closest<HTMLElement>('.button--primary');
    if (!button) return;
    const box = button.getBoundingClientRect();
    const size = Math.max(box.width, box.height) / 2;
    const dot = document.createElement('span');
    dot.className = 'ripple';
    Object.assign(dot.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${event.clientX - box.left - size / 2}px`,
      top: `${event.clientY - box.top - size / 2}px`,
    });
    button.append(dot);
    dot.addEventListener('animationend', () => dot.remove());
  });

  // Rune strokes above section titles: drawn once, when the title shows up.
  const titles = document.querySelectorAll<HTMLElement>('.prose h2');
  if (titles.length > 0 && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('runes');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('rune-drawn');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    titles.forEach((title) => observer.observe(title));
  }
}

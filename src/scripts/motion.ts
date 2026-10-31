/**
 * Behaviour for src/styles/motion.css («Arcano vivo»): the card glow follows
 * the pointer, primary buttons ripple from the click, and section titles draw
 * their rune stroke when they come into view. Nothing runs with «reduce motion».
 *
 * Pages marked data-fx also get smooth scrolling, titles whose words rise from a
 * mask, cards that rise as they come into view and pictures that drift with the
 * scroll. All of it starts from a class this script adds, so without JavaScript
 * every text and picture is simply there.
 */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx = document.querySelector<HTMLElement>('[data-fx]');

/** Wraps each word of an element's text in a mask, so CSS can raise them one after another. */
function splitWords(element: HTMLElement) {
  let index = 0;
  for (const node of [...element.childNodes]) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part.trim()) {
        fragment.append(part);
        continue;
      }
      const mask = document.createElement('span');
      mask.className = 'fx-word';
      const word = document.createElement('span');
      word.style.setProperty('--i', String(index++));
      word.textContent = part;
      mask.append(word);
      fragment.append(mask);
    }
    node.replaceWith(fragment);
  }
}

if (!calm && fx) {
  document.documentElement.classList.add('fx');

  // Wheel scrolling glides; touch stays native. Inner scrollers keep their own.
  import('lenis').then(({ default: Lenis }) => {
    new Lenis({
      autoRaf: true,
      anchors: { offset: -80 },
      prevent: (node) => Boolean(node.closest('dialog, .tc__trees, .hs__track, .table-wrap')),
    });
  });

  // The pinned gallery grows once its script runs, after the browser has jumped to
  // a link's anchor, so the jump lands short. Repeat it once the page has its height.
  const realign = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };
  if (location.hash) {
    let moved = false;
    addEventListener('wheel', () => (moved = true), { once: true, passive: true });
    addEventListener('touchstart', () => (moved = true), { once: true, passive: true });
    const again = () => moved || realign();
    if (document.readyState === 'complete') requestAnimationFrame(again);
    else addEventListener('load', again, { once: true });
    void document.fonts.ready.then(again);
  }

  for (const title of fx.querySelectorAll<HTMLElement>('.prose h2, [data-split]')) splitWords(title);
  for (const title of fx.querySelectorAll<HTMLElement>('[data-split]')) title.classList.add('rune-drawn');

  // Cards and tiles rise once as they come into view, one after another within their group.
  const rising = fx.querySelectorAll<HTMLElement>('.tile, .hub__card, .bar, .stack-card__main, .spec-builds__pros > section, .chain--loose > li');
  const riseObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        riseObserver.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  for (const element of rising) {
    element.classList.add('fx-rise');
    const siblings = element.parentElement ? [...element.parentElement.children] : [];
    element.style.setProperty('--i', String(Math.min(siblings.indexOf(element), 6)));
    riseObserver.observe(element);
  }

  // Pictures drift a little slower than the page.
  const drifting = [...fx.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (drifting.length > 0) {
    let frame = 0;
    const drift = () => {
      frame = 0;
      for (const picture of drifting) {
        const box = picture.parentElement!.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) continue;
        picture.style.transform = `translate3d(0, ${(box.top * -Number(picture.dataset.parallax)).toFixed(1)}px, 0)`;
      }
    };
    addEventListener('scroll', () => (frame ||= requestAnimationFrame(drift)), { passive: true });
    drift();
  }
}

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

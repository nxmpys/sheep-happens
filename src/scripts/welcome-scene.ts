/**
 * «Why this guide exists» told by the scroll. On screens with room, the section
 * pins: the title starts large in the middle of a dark library, moves aside, the
 * words light up one by one, the library brightens as they do, and at the end
 * the grimoire turns to face the reader and opens by itself. Elsewhere the words
 * light up as each paragraph crosses the screen. With reduced motion none of
 * this runs and the markup stays a plain section.
 */
const PIN_QUERY = '(min-width: 900px) and (min-height: 680px)';
/** Share of the pinned scroll at which each thing happens. */
const TITLE_END = 0.12;
const WORDS_START = 0.1;
const WORDS_END = 0.66;
const OPEN_AT = 0.72;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * (3 - 2 * t);

function splitWords(paragraph: HTMLElement): HTMLElement[] {
  const words = (paragraph.textContent ?? '').trim().split(/\s+/);
  paragraph.textContent = '';
  return words.map((word, i) => {
    const span = document.createElement('span');
    span.className = 'welcome-word';
    span.textContent = word;
    paragraph.append(span, i < words.length - 1 ? ' ' : '');
    return span;
  });
}

export function startWelcomeScene(section: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const title = section.querySelector<HTMLElement>('[data-welcome-title]');
  const paragraphs = [...section.querySelectorAll<HTMLElement>('[data-welcome-text]')];
  const toggle = section.querySelector<HTMLButtonElement>('[data-grimoire-toggle]');
  const book = section.querySelector<HTMLElement>('[data-grimoire]');
  if (!title || paragraphs.length === 0) return;

  const groups = paragraphs.map((paragraph) => ({ paragraph, words: splitWords(paragraph) }));
  const allWords = groups.flatMap((group) => group.words);
  let lit = 0;
  const light = (count: number) => {
    if (count === lit) return;
    allWords.forEach((word, i) => {
      if (i >= Math.min(lit, count) && i < Math.max(lit, count)) word.classList.toggle('is-lit', i < count);
    });
    lit = count;
  };

  const pinned = matchMedia(PIN_QUERY);
  // Set once the reader works the book by hand: from then on it is theirs.
  let handled = false;
  let auto = false;
  toggle?.addEventListener('click', () => {
    if (!auto) handled = true;
  });
  const setBook = (open: boolean) => {
    section.classList.toggle('is-open', open);
    if (handled || !toggle || !book || (book.dataset.open === 'true') === open) return;
    auto = true;
    toggle.click();
    auto = false;
  };

  /** How far the title has to travel to start in the middle of the window. */
  const measure = () => {
    section.style.setProperty('--intro', '0');
    const box = title.getBoundingClientRect();
    const scale = 1.5;
    section.style.setProperty('--title-x', `${(innerWidth - box.width * scale) / 2 - box.left}px`);
    section.style.setProperty('--title-y', `${(innerHeight - box.height * scale) / 2 - box.top + section.querySelector<HTMLElement>('[data-welcome-pin]')!.getBoundingClientRect().top}px`);
    section.style.setProperty('--title-scale', String(scale));
  };

  const update = () => {
    const box = section.getBoundingClientRect();
    if (pinned.matches) {
      const p = clamp(-box.top / Math.max(1, box.height - innerHeight));
      const intro = 1 - smooth(clamp(p / TITLE_END));
      const enter = smooth(clamp((p - TITLE_END * 0.6) / 0.42));
      section.style.setProperty('--p', p.toFixed(4));
      section.style.setProperty('--intro', intro.toFixed(4));
      section.style.setProperty('--enter', enter.toFixed(4));
      light(Math.round(clamp((p - WORDS_START) / (WORDS_END - WORDS_START)) * allWords.length));
      setBook(p >= OPEN_AT);
    } else {
      // Each paragraph lights from when its top nears the bottom of the window until its end passes the middle.
      let count = 0;
      for (const { paragraph, words } of groups) {
        const rect = paragraph.getBoundingClientRect();
        const start = innerHeight * 0.88;
        const end = innerHeight * 0.5;
        count += Math.round(clamp((start - rect.top) / Math.max(1, start - end + rect.height)) * words.length);
      }
      section.style.setProperty('--p', clamp(1 - box.top / innerHeight).toFixed(4));
      light(count);
    }
  };

  const apply = () => {
    section.classList.toggle('is-scene', pinned.matches);
    section.classList.toggle('is-flow', !pinned.matches);
    if (pinned.matches) measure();
    else setBook(false);
    update();
  };
  section.classList.add('is-split');
  apply();
  pinned.addEventListener('change', apply);
  addEventListener('resize', apply);
  document.fonts?.ready.then(apply);

  let queued = false;
  addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    },
    { passive: true },
  );
}

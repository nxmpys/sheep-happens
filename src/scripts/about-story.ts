/**
 * Behaviour of the about page story (src/components/about/AboutStory.astro):
 * - text and pictures come in as they reach the viewport (only with motion allowed);
 * - in the pinned scenes, the step crossing the middle of the screen picks the picture,
 *   and plays its live wallpaper if it has one (never with reduced motion: the poster stays);
 * - the chapter crossing the middle sets the ambient colour and the progress mark;
 * - the hero's layers drift with the scroll while it is on screen.
 * Native scroll throughout; every observer and listener is dropped on pagehide.
 */
const story = document.querySelector<HTMLElement>('[data-story]');

if (story && 'IntersectionObserver' in window) {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observers: IntersectionObserver[] = [];
  const watch = (callback: (entry: IntersectionObserverEntry) => void, options: IntersectionObserverInit) => {
    const observer = new IntersectionObserver((entries) => entries.forEach(callback), options);
    observers.push(observer);
    return observer;
  };
  /** A zero-height line across the middle of the screen. */
  const middle: IntersectionObserverInit = { rootMargin: '-50% 0px -50% 0px' };

  if (!calm) {
    story.classList.add('is-live');
    const reveal = watch(
      (entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    story.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element));
  }

  for (const scrolly of story.querySelectorAll<HTMLElement>('[data-scrolly]')) {
    const stage = scrolly.querySelector<HTMLElement>('[data-stage]')!;
    const steps = [...scrolly.querySelectorAll<HTMLElement>('[data-step]')];
    const videos = [...stage.querySelectorAll<HTMLVideoElement>('[data-story-video]')];
    let onScreen = false;
    // Only the live wallpaper of the current step plays, and only while the stage is on screen.
    const syncVideos = () => {
      for (const video of videos) {
        const current = video.closest<HTMLElement>('[data-layer]')?.dataset.layer === stage.dataset.active;
        if (!calm && onScreen && current) video.play().catch(() => {});
        else if (!video.paused) video.pause();
      }
    };
    steps[0]?.classList.add('is-active');
    const observer = watch(
      (entry) => {
        if (!entry.isIntersecting) return;
        const step = entry.target as HTMLElement;
        if (stage.dataset.active === step.dataset.step) return;
        stage.dataset.active = step.dataset.step;
        // Replays the chapter's change effect (fel slash or arcane ring) from the start.
        stage.classList.remove('is-shifting');
        void stage.offsetWidth;
        stage.classList.add('is-shifting');
        steps.forEach((other) => other.classList.toggle('is-active', other === step));
        syncVideos();
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    steps.forEach((step) => observer.observe(step));
    if (videos.length > 0) {
      watch(
        (entry) => {
          onScreen = entry.isIntersecting;
          syncVideos();
        },
        {},
      ).observe(stage);
    }
  }

  const links = [...story.querySelectorAll<HTMLAnchorElement>('[data-progress-link]')];
  const chapters = watch((entry) => {
    if (!entry.isIntersecting) return;
    const chapter = entry.target as HTMLElement;
    story.dataset.chapter = chapter.dataset.chapter;
    for (const link of links) {
      if (link.dataset.progressLink === chapter.id) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    }
  }, middle);
  story.querySelectorAll('[data-chapter]:not([data-story])').forEach((chapter) => chapters.observe(chapter));

  // Hero parallax: --p goes from 0 to 1 as the hero scrolls out; CSS turns it into movement.
  const hero = story.querySelector<HTMLElement>('[data-hero]');
  let frame = 0;
  const update = () => {
    frame = 0;
    if (!hero) return;
    const box = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -box.top / box.height));
    hero.style.setProperty('--p', progress.toFixed(3));
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  if (hero && !calm) {
    watch(
      (entry) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      {},
    ).observe(hero);
  }

  // A page kept in the back/forward cache comes back as it was, observers included.
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    observers.forEach((observer) => observer.disconnect());
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
  });
}

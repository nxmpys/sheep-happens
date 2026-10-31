/**
 * The faint background of a talent tree's page, on a canvas behind the content:
 * snow falling on Frost, embers rising on Fire, and motes with slow rune circles
 * on Arcane. It must stay almost unnoticed: small, slow and very transparent.
 * Nothing runs with «reduce motion», and it stops while the tab is hidden.
 */
import { isDarkPage, onThemeChange } from './page-theme';

type Tree = 'arcane' | 'fire' | 'frost';

interface Mote {
  x: number;
  y: number;
  size: number;
  speed: number;
  /** Phase and rate of its sway and flicker. */
  phase: number;
  rate: number;
  alpha: number;
}

interface Rune {
  x: number;
  y: number;
  radius: number;
  turn: number;
  spin: number;
  drift: number;
  /** Its own marks, so no two circles look the same. */
  marks: number;
}

const TAU = Math.PI * 2;
const random = (from: number, to: number) => from + Math.random() * (to - from);

/** Particles per million pixels of window: fewer on a phone, and never many. */
const DENSITY: Record<Tree, number> = { frost: 46, fire: 20, arcane: 18 };

/** A soft dot drawn once and stamped, far cheaper than a blur on every frame. */
function softDot(color: string): HTMLCanvasElement {
  const dot = document.createElement('canvas');
  dot.width = dot.height = 64;
  const context = dot.getContext('2d')!;
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, color);
  glow.addColorStop(0.35, color);
  glow.addColorStop(1, 'transparent');
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  return dot;
}

function start(canvas: HTMLCanvasElement, tree: Tree) {
  const context = canvas.getContext('2d');
  if (!context) return;
  let width = 0;
  let height = 0;
  let scale = 1;
  let motes: Mote[] = [];
  let runes: Rune[] = [];
  let dot = softDot('#fff');
  let dark = true;
  let color = '#fff';
  let last = 0;
  let frame = 0;

  const newMote = (anywhere: boolean): Mote => {
    const size = tree === 'frost' ? random(1, 2.6) : tree === 'fire' ? random(1, 2.4) : random(0.8, 2);
    // Snow enters from the top; embers and motes rise from the bottom.
    const y = anywhere ? random(0, height) : tree === 'frost' ? -10 : height + 10;
    return {
      x: random(0, width),
      y,
      size,
      // Bigger means nearer, and nearer means faster: that is what gives it depth.
      speed: (tree === 'frost' ? 9 : tree === 'fire' ? 11 : 3) * size * random(0.8, 1.2),
      phase: random(0, TAU),
      rate: random(0.25, 0.7),
      alpha: random(0.35, 1),
    };
  };
  /** Reads the page's accent, which already follows the tree and the light or dark theme. */
  const readColors = () => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--accent)';
    document.body.append(probe);
    color = getComputedStyle(probe).color;
    probe.remove();
    dark = isDarkPage();
    // Snow is white in the dark; on a light page white would not show, so it takes the accent.
    dot = softDot(tree === 'frost' && dark ? '#dff1ff' : color);
  };
  const measure = () => {
    scale = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.round((DENSITY[tree] * (width * height)) / 1_000_000);
    motes = Array.from({ length: count }, () => newMote(true));
    if (tree === 'arcane') {
      const circles = width < 700 ? 2 : 4;
      runes = Array.from({ length: circles }, (_, i) => ({
        x: width * ((i + random(0.2, 0.8)) / circles),
        y: random(0, height),
        radius: random(60, 150),
        turn: random(0, TAU),
        spin: random(0.015, 0.04) * (i % 2 ? 1 : -1),
        drift: random(1.2, 3),
        marks: Math.floor(random(5, 9)),
      }));
    }
  };

  const drawRune = (rune: Rune) => {
    context.save();
    context.translate(rune.x, rune.y);
    context.rotate(rune.turn);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.globalAlpha = dark ? 0.06 : 0.07;
    context.beginPath();
    context.arc(0, 0, rune.radius, 0, TAU);
    context.moveTo(rune.radius * 0.72, 0);
    context.arc(0, 0, rune.radius * 0.72, 0, TAU);
    // A star joining the marks, and a tick on the ring for each.
    for (let i = 0; i <= rune.marks; i++) {
      const angle = (i * 2 * TAU) / rune.marks;
      const x = Math.cos(angle) * rune.radius * 0.72;
      const y = Math.sin(angle) * rune.radius * 0.72;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    for (let i = 0; i < rune.marks; i++) {
      const angle = (i * TAU) / rune.marks;
      context.moveTo(Math.cos(angle) * rune.radius * 0.9, Math.sin(angle) * rune.radius * 0.9);
      context.lineTo(Math.cos(angle) * rune.radius, Math.sin(angle) * rune.radius);
    }
    context.stroke();
    context.restore();
  };

  const draw = (now: number) => {
    frame = requestAnimationFrame(draw);
    // A long pause (a hidden tab) must not make everything jump.
    const seconds = Math.min((now - last) / 1000, 0.05);
    last = now;
    const time = now / 1000;
    context.clearRect(0, 0, width, height);

    for (const rune of runes) {
      rune.turn += rune.spin * seconds;
      rune.y -= rune.drift * seconds;
      if (rune.y < -rune.radius - 10) {
        rune.y = height + rune.radius + 10;
        rune.x = random(0, width);
      }
      drawRune(rune);
    }

    context.globalCompositeOperation = dark ? 'lighter' : 'source-over';
    for (let i = 0; i < motes.length; i++) {
      const mote = motes[i]!;
      let alpha: number;
      if (tree === 'frost') {
        mote.y += mote.speed * seconds;
        mote.x += Math.sin(time * mote.rate + mote.phase) * 8 * seconds;
        alpha = (dark ? 0.22 : 0.2) * mote.alpha;
        if (mote.y > height + 10) motes[i] = newMote(false);
      } else if (tree === 'fire') {
        mote.y -= mote.speed * seconds;
        mote.x += Math.sin(time * mote.rate + mote.phase) * 14 * seconds;
        // Embers flicker and die out on the way up.
        const life = Math.max(0, mote.y / height);
        alpha = (dark ? 0.32 : 0.26) * mote.alpha * life * (0.65 + 0.35 * Math.sin(time * 3 * mote.rate + mote.phase));
        if (mote.y < height * 0.05) motes[i] = newMote(false);
      } else {
        mote.y -= mote.speed * seconds;
        mote.x += Math.sin(time * mote.rate + mote.phase) * 5 * seconds;
        // Motes breathe in and out, like the sparkles on a spell.
        alpha = (dark ? 0.28 : 0.24) * mote.alpha * (0.5 + 0.5 * Math.sin(time * mote.rate * 2 + mote.phase));
        if (mote.y < -10) motes[i] = newMote(false);
      }
      context.globalAlpha = alpha;
      const size = mote.size * 3.2;
      context.drawImage(dot, mote.x - size, mote.y - size, size * 2, size * 2);
    }
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1;
  };

  const run = () => {
    cancelAnimationFrame(frame);
    if (document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(draw);
  };

  readColors();
  measure();
  addEventListener('resize', measure);
  document.addEventListener('visibilitychange', run);
  onThemeChange(readColors);
  run();
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-ambience]');
if (canvas && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  start(canvas, canvas.dataset.ambience as Tree);
}

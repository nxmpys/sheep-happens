/**
 * The «What do you need?» sphere. Each question is a curved picture card on a
 * globe seen from outside; the far side shows through, mirrored. Scrolling the
 * pinned section turns the globe from one question to the next, and light arcs
 * drift behind it. Plain WebGL, no library. It runs only while on screen, and
 * if WebGL or motion is unavailable the cards stay as the grid in the markup.
 */
const CARD_W = 0.82;
const CARD_H = 0.46;
const SCENERY_W = 0.72;
const SCENERY_H = 0.4;
const FOV = (40 * Math.PI) / 180;
const TILT = -0.09;
const GRID_X = 28;
const GRID_Y = 16;

const ARC_VERTEX = `
attribute vec2 aPos;
varying vec2 vPos;
void main() { vPos = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const ARC_FRAGMENT = `
precision mediump float;
varying vec2 vPos;
uniform float uAspect;
uniform float uTime;
uniform float uTurn;
float arc(vec2 p, vec2 centre, float radius, float width) {
  return width / (abs(length(p - centre) - radius) + 0.012);
}
float grain(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 p = vec2(vPos.x * uAspect, vPos.y);
  float t = uTime * 0.03 + uTurn * 0.09;
  float g = 0.0;
  g += arc(p, vec2(1.5 * cos(t), -1.2 + 0.3 * sin(t)), 1.9, 0.010);
  g += arc(p, vec2(-1.6 + 0.4 * sin(t * 0.7), 1.1 * cos(t * 0.9)), 2.2, 0.008);
  g += arc(p, vec2(0.4 * sin(t * 1.3), 1.9), 1.6, 0.006);
  g += arc(p, vec2(2.0, 0.8 * sin(t)), 2.8, 0.006);
  vec3 colour = vec3(0.02, 0.03, 0.06) + vec3(0.03, 0.27, 0.95) * g;
  colour += (grain(vPos * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(colour, 1.0);
}`;

const CARD_VERTEX = `
attribute vec2 aUv;
uniform vec4 uCard;
uniform mat3 uTurn;
uniform float uDistance;
uniform float uFocal;
uniform float uAspect;
uniform vec2 uShift;
varying vec2 vUv;
varying float vFacing;
void main() {
  vUv = aUv;
  float lat = uCard.y + (aUv.y - 0.5) * uCard.w;
  float lon = uCard.x + (aUv.x - 0.5) * uCard.z / cos(uCard.y);
  vec3 p = uTurn * vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
  vec3 toCamera = normalize(vec3(0.0, 0.0, uDistance) - p);
  vFacing = dot(p, toCamera);
  float w = uDistance - p.z;
  gl_Position = vec4(p.x * uFocal / uAspect + uShift.x * w, p.y * uFocal + uShift.y * w, (w - 0.1) / 8.0 * w, w);
}`;

const CARD_FRAGMENT = `
precision mediump float;
varying vec2 vUv;
varying float vFacing;
uniform sampler2D uImage;
uniform float uActive;
void main() {
  vec2 half_ = vec2(0.889, 0.5);
  vec2 q = abs(vUv - 0.5) * vec2(1.778, 1.0);
  float d = length(max(q - half_ + 0.05, 0.0)) - 0.05;
  float alpha = 1.0 - smoothstep(-0.008, 0.0, d);
  if (alpha <= 0.0) discard;
  vec3 colour = texture2D(uImage, vUv).rgb;
  float light = vFacing < 0.0 ? 0.3 : 0.42 + 0.58 * smoothstep(0.0, 0.85, vFacing);
  colour *= light * mix(0.68, 1.0, uActive);
  colour += vec3(0.25, 0.5, 1.0) * uActive * (1.0 - smoothstep(0.0, 0.012, abs(d + 0.006)));
  gl_FragColor = vec4(colour * alpha, alpha);
}`;

interface Card {
  lon: number;
  lat: number;
  w: number;
  h: number;
  texture: WebGLTexture;
  question: number;
  src: string;
  text?: string;
}

function program(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const compiled = gl.createProgram()!;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(compiled, shader);
  }
  gl.linkProgram(compiled);
  return gl.getProgramParameter(compiled, gl.LINK_STATUS) ? compiled : null;
}

/** The picture with its question written on it, as the texture of a card. */
function questionTexture(image: HTMLImageElement, text: string, number: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 540;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, 960, 540);
  const shade = ctx.createLinearGradient(0, 240, 0, 540);
  shade.addColorStop(0, 'rgba(5,7,15,0)');
  shade.addColorStop(1, 'rgba(5,7,15,0.88)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = '#fff';
  ctx.font = "600 56px 'Fraunces Variable', Georgia, serif";
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 860 && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  lines.push(line);
  [...lines].reverse().forEach((row, i) => ctx.fillText(row, 48, 496 - i * 62));
  ctx.font = "600 22px 'Nunito Variable', system-ui, sans-serif";
  ctx.fillStyle = '#8db8ff';
  ctx.fillText(String(number).padStart(2, '0'), 48, 496 - lines.length * 62 - 4);
  return canvas;
}

export function startQuestionGlobe(section: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = section.querySelector<HTMLCanvasElement>('[data-globe-canvas]');
  const items = [...section.querySelectorAll<HTMLElement>('[data-card]')];
  // The canvas is display:none until the section switches on; give it a context first.
  const gl = canvas?.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'low-power' });
  if (!canvas || !gl || items.length === 0) return;

  const arcs = program(gl, ARC_VERTEX, ARC_FRAGMENT);
  const cardsProgram = program(gl, CARD_VERTEX, CARD_FRAGMENT);
  if (!arcs || !cardsProgram) return;

  const count = items.length;
  const blank = (): WebGLTexture => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([24, 32, 60, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return texture;
  };

  // Questions on a band around the equator, zigzag; scenery in a ring above and one below.
  const cards: Card[] = items.map((item, i) => ({
    lon: (i * 2 * Math.PI) / count,
    lat: i % 2 ? 0.26 : -0.26,
    w: CARD_W,
    h: CARD_H,
    texture: blank(),
    question: i,
    src: item.dataset.image!,
    text: item.dataset.q!,
  }));
  const scenery: string[] = JSON.parse(section.dataset.scenery ?? '[]');
  scenery.forEach((src, i) => {
    const ring = i % 2;
    cards.push({
      lon: ((Math.floor(i / 2) + ring * 0.5) * 2 * Math.PI) / Math.ceil(scenery.length / 2),
      lat: ring ? 0.88 : -0.88,
      w: SCENERY_W,
      h: SCENERY_H,
      texture: blank(),
      question: -1,
      src,
    });
  });

  // One grid of vertices, bent onto the sphere in the shader for each card.
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let y = 0; y <= GRID_Y; y++) for (let x = 0; x <= GRID_X; x++) vertices.push(x / GRID_X, y / GRID_Y);
  for (let y = 0; y < GRID_Y; y++) {
    for (let x = 0; x < GRID_X; x++) {
      const a = y * (GRID_X + 1) + x;
      indices.push(a, a + 1, a + GRID_X + 1, a + 1, a + GRID_X + 2, a + GRID_X + 1);
    }
  }
  const gridBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const u = {
    arcAspect: gl.getUniformLocation(arcs, 'uAspect'),
    arcTime: gl.getUniformLocation(arcs, 'uTime'),
    arcTurn: gl.getUniformLocation(arcs, 'uTurn'),
    card: gl.getUniformLocation(cardsProgram, 'uCard'),
    turn: gl.getUniformLocation(cardsProgram, 'uTurn'),
    distance: gl.getUniformLocation(cardsProgram, 'uDistance'),
    focal: gl.getUniformLocation(cardsProgram, 'uFocal'),
    aspect: gl.getUniformLocation(cardsProgram, 'uAspect'),
    shift: gl.getUniformLocation(cardsProgram, 'uShift'),
    active: gl.getUniformLocation(cardsProgram, 'uActive'),
  };
  const aPos = gl.getAttribLocation(arcs, 'aPos');
  const aUv = gl.getAttribLocation(cardsProgram, 'aUv');

  section.classList.add('is-globe');

  let loadingStarted = false;
  const loadTextures = () => {
    if (loadingStarted) return;
    loadingStarted = true;
    const fonts = document.fonts?.load("600 56px 'Fraunces Variable'").catch(() => undefined) ?? Promise.resolve();
    for (const [i, card] of cards.entries()) {
      const image = new Image();
      image.decoding = 'async';
      image.onload = async () => {
        if (card.text) await fonts;
        gl.bindTexture(gl.TEXTURE_2D, card.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, card.text ? questionTexture(image, card.text, i + 1) : image);
      };
      image.src = card.src;
    }
  };

  let width = 1;
  let height = 1;
  let distance = 2.4;
  let focal = 1;
  let shift: [number, number] = [0, 0];
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    width = Math.max(1, Math.round(box.width * dpr));
    height = Math.max(1, Math.round(box.height * dpr));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    const aspect = width / height;
    const wide = box.width > 820;
    // The front card fills the same share of the window at any shape, a phone's included.
    const usable = wide ? 0.58 : 0.92;
    focal = 1 / Math.tan(FOV / 2);
    distance = Math.max(2.15, 1 + (CARD_W * focal) / (2 * aspect * usable));
    shift = wide ? [0.34, 0.02] : [0, 0.08];
  };
  resize();
  addEventListener('resize', resize);

  let stop = 0;
  let shown = 0;
  let active = -1;
  let pointerX = 0;
  let pointerY = 0;
  let swayX = 0;
  let swayY = 0;

  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
  };

  const scrollRange = () => section.offsetHeight - innerHeight;
  const readScroll = () => {
    const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / Math.max(1, scrollRange())));
    const raw = progress * (count - 1);
    const whole = Math.floor(raw);
    const part = raw - whole;
    // Rests on each question, then moves on to the next.
    const t = Math.min(1, Math.max(0, (part - 0.3) / 0.4));
    stop = whole + t * t * (3 - 2 * t);
    setActive(Math.round(raw));
  };
  readScroll();

  const turnAt = (value: number) => {
    const whole = Math.floor(value);
    const part = value - whole;
    const lat = (i: number) => cards[Math.min(i, count - 1)]!.lat;
    const yaw = -(value * 2 * Math.PI) / count + swayX;
    const pitch = lat(whole) + (lat(whole + 1) - lat(whole)) * part + swayY;
    const [cy, sy, cx, sx, cz, sz] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch), Math.cos(TILT), Math.sin(TILT)];
    // Z tilt · X pitch · Y yaw, by columns.
    const m = [cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy];
    return new Float32Array([
      cz * m[0]! - sz * m[1]!, sz * m[0]! + cz * m[1]!, m[2]!,
      cz * m[3]! - sz * m[4]!, sz * m[3]! + cz * m[4]!, m[5]!,
      cz * m[6]! - sz * m[7]!, sz * m[6]! + cz * m[7]!, m[8]!,
    ]);
  };

  const depthOf = (card: Card, turn: Float32Array) => {
    const [x, y, z] = [Math.cos(card.lat) * Math.sin(card.lon), Math.sin(card.lat), Math.cos(card.lat) * Math.cos(card.lon)];
    return turn[2]! * x + turn[5]! * y + turn[8]! * z;
  };

  const start = performance.now();
  const draw = (now: number) => {
    shown += (stop - shown) * 0.1;
    swayX += (pointerX * 0.05 - swayX) * 0.05;
    swayY += (pointerY * 0.03 - swayY) * 0.05;
    const aspect = width / height;
    const turn = turnAt(shown);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.useProgram(arcs);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(u.arcAspect, aspect);
    gl.uniform1f(u.arcTime, (now - start) / 1000);
    gl.uniform1f(u.arcTurn, shown);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(cardsProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.uniformMatrix3fv(u.turn, false, turn);
    gl.uniform1f(u.distance, distance);
    gl.uniform1f(u.focal, focal);
    gl.uniform1f(u.aspect, aspect);
    gl.uniform2f(u.shift, shift[0], shift[1]);
    // Far ones first, so the rounded corners blend over what is behind them.
    for (const card of [...cards].sort((a, b) => depthOf(a, turn) - depthOf(b, turn))) {
      gl.bindTexture(gl.TEXTURE_2D, card.texture);
      gl.uniform4f(u.card, card.lon, card.lat, card.w, card.h);
      gl.uniform1f(u.active, card.question < 0 ? 0 : Math.max(0, 1 - Math.abs(card.question - shown) * 2));
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
  };

  let frame = 0;
  const loop = (now: number) => {
    readScroll();
    draw(now);
    frame = requestAnimationFrame(loop);
  };
  const seen = new IntersectionObserver(
    ([entry]) => {
      cancelAnimationFrame(frame);
      if (entry?.isIntersecting) {
        loadTextures();
        frame = requestAnimationFrame(loop);
      }
    },
    { rootMargin: '30% 0px' },
  );
  seen.observe(section);

  // A card on the sphere is as clickable as its link: which one is under the pointer?
  const cardAt = (clientX: number, clientY: number) => {
    const box = canvas.getBoundingClientRect();
    const aspect = width / height;
    const nx = ((clientX - box.left) / box.width) * 2 - 1 - shift[0];
    const ny = 1 - ((clientY - box.top) / box.height) * 2 - shift[1];
    const dir = [(nx * aspect) / focal, ny / focal, -1];
    const b = distance * dir[2]!;
    const a = dir[0]! ** 2 + dir[1]! ** 2 + 1;
    const disc = b * b - a * (distance * distance - 1);
    if (disc < 0) return -1;
    const t = (-b - Math.sqrt(disc)) / a;
    const p = [dir[0]! * t, dir[1]! * t, distance + dir[2]! * t];
    const turn = turnAt(shown);
    // The inverse of a rotation is its transpose.
    const x = turn[0]! * p[0]! + turn[1]! * p[1]! + turn[2]! * p[2]!;
    const y = turn[3]! * p[0]! + turn[4]! * p[1]! + turn[5]! * p[2]!;
    const z = turn[6]! * p[0]! + turn[7]! * p[1]! + turn[8]! * p[2]!;
    const lat = Math.asin(y);
    const lon = Math.atan2(x, z);
    for (let i = 0; i < count; i++) {
      const card = cards[i]!;
      const delta = Math.atan2(Math.sin(lon - card.lon), Math.cos(lon - card.lon));
      if (Math.abs(lat - card.lat) < card.h / 2 && Math.abs(delta) < card.w / 2 / Math.cos(card.lat)) return i;
    }
    return -1;
  };
  canvas.addEventListener('pointermove', (event) => {
    const box = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - box.left) / box.width) * 2 - 1;
    pointerY = ((event.clientY - box.top) / box.height) * 2 - 1;
    canvas.classList.toggle('is-over', cardAt(event.clientX, event.clientY) >= 0);
  });
  canvas.addEventListener('click', (event) => {
    const index = cardAt(event.clientX, event.clientY);
    if (index >= 0) items[index]!.querySelector('a')?.click();
  });

  // Keyboard: tabbing to a question turns the sphere to it.
  items.forEach((item, i) => {
    item.addEventListener('focusin', () => {
      // After the browser's own scroll to the focused element, which would undo this one.
      requestAnimationFrame(() => {
        const top = section.getBoundingClientRect().top + scrollY;
        scrollTo({ top: top + (i / (count - 1)) * scrollRange(), behavior: 'instant' });
      });
    });
  });

  // Without its context the sphere is gone: back to the grid.
  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(frame);
    seen.disconnect();
    section.classList.remove('is-globe');
  });
}

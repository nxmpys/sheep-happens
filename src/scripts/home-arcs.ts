/**
 * The blue arcs behind the home page, from the end of the hero down, drawn in
 * plain WebGL over the page's own colour in either theme. They drift slowly and
 * with the scroll; they stay still with reduced motion, and run only on screen.
 * Without WebGL the canvas stays empty over the page's colour.
 */
import { isDarkPage, onThemeChange } from './page-theme';

const VERTEX = `
attribute vec2 aPos;
varying vec2 vPos;
void main() { vPos = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAGMENT = `
precision mediump float;
varying vec2 vPos;
uniform float uAspect;
uniform float uTime;
uniform float uTurn;
uniform vec3 uBase;
uniform vec3 uTint;
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
  vec3 colour = uBase + uTint * g;
  colour += (grain(vPos * 91.0) - 0.5) * 0.02;
  gl_FragColor = vec4(colour, 1.0);
}`;

function compile(gl: WebGLRenderingContext) {
  const compiled = gl.createProgram()!;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(compiled, shader);
  }
  gl.linkProgram(compiled);
  return gl.getProgramParameter(compiled, gl.LINK_STATUS) ? compiled : null;
}

export function startHomeArcs(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const shader = compile(gl);
  if (!shader) return;
  gl.useProgram(shader);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(shader, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const uniform = (name: string) => gl.getUniformLocation(shader, name);
  const [uAspect, uTime, uTurn, uBase, uTint] = ['uAspect', 'uTime', 'uTurn', 'uBase', 'uTint'].map(uniform);

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now();
  const draw = (now: number) => {
    gl.uniform1f(uTime!, still ? 0 : (now - start) / 1000);
    gl.uniform1f(uTurn!, still ? 0 : scrollY / (innerHeight * 0.62));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const paint = () => {
    const [r = 0, g = 0, b = 0] = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
    gl.uniform3f(uBase!, r / 255, g / 255, b / 255);
    // Light adds up in the dark; on a light page the lines take away everything but blue.
    if (isDarkPage()) gl.uniform3f(uTint!, 0.03, 0.27, 0.95);
    else gl.uniform3f(uTint!, -0.34, -0.2, -0.015);
    draw(performance.now());
  };
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(box.width));
    canvas.height = Math.max(1, Math.round(box.height));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uAspect!, canvas.width / canvas.height);
    draw(performance.now());
  };
  resize();
  paint();
  addEventListener('resize', resize);
  onThemeChange(paint);
  // The body's colour changes with a transition-free swap, but the first read can precede the styles.
  document.fonts?.ready.then(paint);
  if (still) return;

  let frame = 0;
  const loop = (now: number) => {
    draw(now);
    frame = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    if (entry?.isIntersecting) frame = requestAnimationFrame(loop);
  }).observe(canvas);
}

import React, { useEffect, useRef } from 'react';
import { COVER_IMAGES, COVER_COLORS, COVER_FONT, COVER_WEIGHT, coverMetrics, ensureCoverFont } from './coverLayout';
import './CrumpleTransition.css';

/**
 * WebGL crumpled-paper transition.
 * open:  a paper ball pops out of `origin`, travels to the centre and unfolds
 *        into the full-screen cover poster, then dissolves into the real page.
 * close: the poster fades in over the page, crumples into a ball and is
 *        tossed back into `origin`.
 */

const VERT = `
attribute vec2 a_uv;
uniform float u_c;
uniform float u_aspect;
uniform vec2 u_offset;
uniform float u_scale;
uniform mat3 u_rot;
uniform vec4 u_dir[8];
uniform float u_amp[8];
varying vec2 v_uv;
varying vec2 v_p;

float tri(float x) { return abs(fract(x) - 0.5) * 2.0 - 0.5; }

float field(vec2 p) {
  float z = 0.0;
  for (int i = 0; i < 8; i++) {
    z += u_amp[i] * tri(dot(p, u_dir[i].xy) * u_dir[i].z + u_dir[i].w);
  }
  return z;
}

void main() {
  vec2 p = (a_uv * 2.0 - 1.0) * vec2(u_aspect, 1.0);
  float c = u_c;
  float k = 1.0 - 0.64 * c;
  float z = c * 0.5 * field(p);
  vec2 wob = vec2(sin(p.y * 2.7 + 1.3) + sin(p.x * 4.1 + 0.2), sin(p.x * 3.3 + 0.4) + sin(p.y * 4.6 + 2.0));
  vec2 q = p * k + c * 0.07 * wob;
  z -= c * c * 0.75 * dot(q, q);
  vec3 pos = u_rot * vec3(q, z);
  pos = pos * u_scale + vec3(u_offset, 0.0);
  float w = (3.0 - pos.z) / 3.0;
  v_uv = a_uv;
  v_p = p;
  gl_Position = vec4(pos.x / u_aspect, pos.y, -pos.z * 0.12 * w, w);
}
`;

const FRAG = `
precision highp float;
uniform sampler2D u_tex;
uniform float u_c;
uniform mat3 u_rot;
uniform vec4 u_dir[8];
uniform float u_amp[8];
varying vec2 v_uv;
varying vec2 v_p;

void main() {
  float c = u_c;
  float k = 1.0 - 0.64 * c;
  vec2 g = vec2(0.0);
  float crease = 0.0;
  for (int i = 0; i < 8; i++) {
    float x = dot(v_p, u_dir[i].xy) * u_dir[i].z + u_dir[i].w;
    float f = fract(x);
    float s = f < 0.5 ? -2.0 : 2.0;
    g += u_amp[i] * u_dir[i].z * s * u_dir[i].xy;
    float d = min(min(f, 1.0 - f), abs(f - 0.5)) / max(u_dir[i].z, 0.001);
    crease += u_amp[i] * (1.0 - smoothstep(0.0, 0.012, d));
  }
  vec2 slope = (c * 0.5 * g) / k - c * c * 1.5 * v_p * k;
  vec3 n = normalize(u_rot * vec3(-slope, 1.0));
  if (!gl_FrontFacing) n = -n;

  vec3 L = normalize(vec3(-0.42, 0.58, 0.7));
  float flatL = L.z;
  float diff = max(dot(n, L), 0.0);
  float shade = 0.3 + 0.7 * diff / flatL;
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), 36.0) * 0.22 * c;
  shade *= 1.0 - c * 0.28 * clamp(crease, 0.0, 1.0);

  vec3 base = gl_FrontFacing ? texture2D(u_tex, v_uv).rgb : vec3(0.62, 0.6, 0.57);
  gl_FragColor = vec4(base * shade + spec, 1.0);
}
`;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const easeOutBack = (t) => {
  const c1 = 1.5;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (u, a, b) => clamp01((u - a) / (b - a));

function rotationMatrix(rx, ry, rz) {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(rx), Math.sin(rx), Math.cos(ry), Math.sin(ry), Math.cos(rz), Math.sin(rz)];
  // Rz * Ry * Rx, column-major for WebGL
  return new Float32Array([
    cz * cy, sz * cy, -sy,
    cz * sy * sx - sz * cx, sz * sy * sx + cz * cx, cy * sx,
    cz * sy * cx + sz * sx, sz * sy * cx - cz * sx, cy * cx,
  ]);
}

function makeFolds() {
  const dirs = new Float32Array(32);
  const amps = new Float32Array(8);
  for (let i = 0; i < 8; i++) {
    const a = Math.random() * Math.PI;
    dirs[i * 4] = Math.cos(a);
    dirs[i * 4 + 1] = Math.sin(a);
    dirs[i * 4 + 2] = i < 3 ? 0.35 + Math.random() * 0.5 : 0.9 + Math.random() * 1.8;
    dirs[i * 4 + 3] = Math.random();
    amps[i] = (i < 3 ? 0.5 : 0.22) * (0.7 + Math.random() * 0.6);
  }
  return { dirs, amps };
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(log);
  }
  return s;
}

function initGL(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));

  const NX = 140;
  const NY = 140;
  const uvs = new Float32Array((NX + 1) * (NY + 1) * 2);
  let o = 0;
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      uvs[o++] = i / NX;
      uvs[o++] = j / NY;
    }
  }
  const idx = new Uint16Array(NX * NY * 6);
  o = 0;
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i;
      const b = a + 1;
      const c = a + NX + 1;
      const d = c + 1;
      idx.set([a, b, c, b, d, c], o);
      o += 6;
    }
  }
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

  gl.useProgram(prog);
  const loc = gl.getAttribLocation(prog, 'a_uv');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u = (n) => gl.getUniformLocation(prog, n);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  return {
    gl,
    tex,
    count: idx.length,
    uni: {
      c: u('u_c'),
      aspect: u('u_aspect'),
      offset: u('u_offset'),
      scale: u('u_scale'),
      rotV: u('u_rot'),
      dir: u('u_dir'),
      amp: u('u_amp'),
      texture: u('u_tex'),
    },
  };
}

function drawSpaced(ctx, text, x, y, tracking) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  return cx;
}

function paintCover(canvas, w, h, images) {
  const ctx = canvas.getContext('2d');
  const scale = canvas.width / w;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = COVER_COLORS.base;
  ctx.fillRect(0, 0, w, h);

  const img = w / h < 1 ? images.tall : images.wide;
  if (img && img.complete && img.naturalWidth) {
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * r;
    const ih = img.naturalHeight * r;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
  }
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(24,22,20,0.28)');
  g.addColorStop(0.45, 'rgba(24,22,20,0.06)');
  g.addColorStop(1, 'rgba(24,22,20,0.4)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const m = coverMetrics(w, h);
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 24;

  ctx.font = `italic ${COVER_WEIGHT} ${m.eyebrowSize}px ${COVER_FONT}`;
  ctx.fillStyle = COVER_COLORS.cream;
  const end = drawSpaced(ctx, 'VOLVER A SONAR', m.left, m.top, m.eyebrowSize * 0.42);
  ctx.fillStyle = COVER_COLORS.rust;
  ctx.fillText('×', end + m.eyebrowSize * 0.2, m.top);

  const ty = m.top + m.eyebrowSize + m.titleGap;
  ctx.font = `${COVER_WEIGHT} ${m.titleSize}px ${COVER_FONT}`;
  let x = m.left + m.indent;
  ctx.fillStyle = COVER_COLORS.cream;
  ctx.fillText('FALLA', x, ty);
  x += ctx.measureText('FALLA').width;
  ctx.fillStyle = COVER_COLORS.rust;
  ctx.fillText('/', x, ty);
  x += ctx.measureText('/').width;
  ctx.fillStyle = COVER_COLORS.cream;
  ctx.fillText('BOCONÓ', x, ty);

  ctx.font = `${COVER_WEIGHT} ${m.lvbSize}px ${COVER_FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText('LA VIDA BOHÈME', w - m.lvbRight, h - m.lvbBottom - m.lvbSize);
  ctx.textAlign = 'left';
}

let assetsPromise = null;
function loadAssets() {
  if (assetsPromise) return assetsPromise;
  const load = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  const fonts = ensureCoverFont();
  assetsPromise = Promise.all([load(COVER_IMAGES.wide), load(COVER_IMAGES.tall), fonts])
    .then(([wide, tall]) => ({ wide, tall }));
  return assetsPromise;
}

export function preloadCrumpleAssets() {
  loadAssets();
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function CrumpleTransition({ run, onCovered, onDone }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const backdropRef = useRef(null);
  const glRef = useRef(null);
  const cbRef = useRef({ onCovered, onDone });
  cbRef.current = { onCovered, onDone };

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (!run) return undefined;
    let cancelled = false;
    let raf = 0;
    const timers = [];
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const backdrop = backdropRef.current;
    const covered = () => !cancelled && cbRef.current.onCovered?.(run);
    const done = () => {
      if (cancelled) return;
      root.classList.remove('is-active');
      cbRef.current.onDone?.(run);
    };

    root.classList.add('is-active');
    canvas.style.opacity = '0';
    backdrop.style.opacity = '0';

    const fallback = () => {
      // Simple dissolve when WebGL or motion is unavailable
      backdrop.style.transition = 'opacity 260ms ease';
      backdrop.style.background = '#8c8984';
      requestAnimationFrame(() => { backdrop.style.opacity = '1'; });
      timers.push(setTimeout(() => {
        covered();
        backdrop.style.opacity = '0';
        timers.push(setTimeout(() => {
          backdrop.style.background = '';
          backdrop.style.transition = '';
          done();
        }, 280));
      }, 280));
    };

    if (prefersReducedMotion()) {
      fallback();
      return () => { cancelled = true; timers.forEach(clearTimeout); };
    }

    const start = async () => {
      let ctx = glRef.current;
      try {
        if (!ctx) ctx = glRef.current = initGL(canvas);
      } catch {
        ctx = null;
      }
      if (!ctx) { fallback(); return; }

      const images = await Promise.race([loadAssets(), new Promise((r) => setTimeout(() => r({}), 600))]);
      if (cancelled) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      const texScale = Math.min(dpr, 2048 / Math.max(W, H));
      const paper = document.createElement('canvas');
      paper.width = Math.round(W * texScale);
      paper.height = Math.round(H * texScale);
      paintCover(paper, W, H, images || {});

      const { gl, tex, uni, count } = ctx;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paper);
      gl.uniform1i(uni.texture, 0);

      const aspect = W / H;
      gl.uniform1f(uni.aspect, aspect);
      const { dirs, amps } = makeFolds();
      gl.uniform4fv(uni.dir, dirs);
      gl.uniform1fv(uni.amp, amps);

      const o = run.origin || { x: W / 2, y: H * 0.62 };
      const ox = (o.x / W * 2 - 1) * aspect;
      const oy = -(o.y / H * 2 - 1);
      // ball ≈ 120px across its longest side
      const ballScale = 120 / (0.42 * Math.max(W, H));
      const spin = Math.random() < 0.5 ? -1 : 1;

      const draw = (c, s, x, y, rx, ry, rz) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (s <= 0.0001) return;
        gl.uniform1f(uni.c, c);
        gl.uniform1f(uni.scale, s);
        gl.uniform2f(uni.offset, x, y);
        gl.uniformMatrix3fv(uni.rotV, false, rotationMatrix(rx, ry, rz));
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
      };

      const frame = (fn, duration, onEnd) => {
        const t0 = performance.now();
        const tick = (now) => {
          if (cancelled) return;
          const u = clamp01((now - t0) / duration);
          fn(u, now - t0);
          if (u < 1) raf = requestAnimationFrame(tick);
          else onEnd?.();
        };
        raf = requestAnimationFrame(tick);
      };

      if (run.mode === 'open') {
        canvas.style.transition = 'none';
        canvas.style.opacity = '1';
        backdrop.style.transition = 'opacity 700ms ease';
        requestAnimationFrame(() => { backdrop.style.opacity = '1'; });

        frame((u, ms) => {
          const pop = easeOutBack(seg(u, 0, 0.14));
          const travel = easeInOutCubic(seg(u, 0.1, 0.78));
          const grow = easeInOutCubic(seg(u, 0.12, 0.8));
          // creases relax fast at first, then settle slowly like a hand smoothing paper
          const relax = seg(u, 0.16, 1);
          const c = Math.pow(1 - relax, 2.2) * (1 - 0.04 * Math.sin(relax * Math.PI));
          const s = (ballScale + (1 - ballScale) * grow) * (u < 0.14 ? pop : 1);
          const x = ox * (1 - travel);
          const y = oy * (1 - travel);
          const wobble = Math.sin(ms / 140) * 0.12 * (1 - travel);
          draw(c, s, x, y, c * 0.7 + wobble, -c * 0.55, spin * c * 1.1);
        }, 1650, () => {
          draw(0, 1, 0, 0, 0, 0, 0);
          covered();
          // let the page paint underneath, then dissolve the sheet
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (cancelled) return;
            backdrop.style.transition = 'none';
            backdrop.style.opacity = '0';
            canvas.style.transition = 'opacity 420ms ease';
            canvas.style.opacity = '0';
            timers.push(setTimeout(done, 440));
          }));
        });
      } else {
        draw(0, 1, 0, 0, 0, 0, 0);
        backdrop.style.transition = 'none';
        backdrop.style.opacity = '1';
        canvas.style.transition = 'opacity 260ms ease';
        requestAnimationFrame(() => { canvas.style.opacity = '1'; });
        timers.push(setTimeout(() => {
          if (cancelled) return;
          covered();
          backdrop.style.transition = 'opacity 900ms ease 250ms';
          backdrop.style.opacity = '0';
          frame((u, ms) => {
            const crumple = easeInOutCubic(seg(u, 0, 0.62));
            const c = crumple;
            const shrink = easeInOutCubic(seg(u, 0.08, 0.72));
            const toss = easeInCubic(seg(u, 0.55, 1));
            const travel = easeOutCubic(seg(u, 0.5, 1));
            const s = (1 - (1 - ballScale) * shrink) * (1 - 0.85 * toss);
            const x = ox * travel;
            const y = oy * travel + Math.sin(travel * Math.PI) * 0.18;
            const wobble = Math.sin(ms / 120) * 0.1 * crumple;
            draw(c, s, x, y, c * 0.7 + wobble + toss * 2.2, -c * 0.55, spin * (c * 1.1 + toss * 3));
            canvas.style.opacity = String(1 - seg(u, 0.88, 1));
          }, 1250, done);
        }, 280));
      }
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      root.classList.remove('is-active');
    };
  }, [run]);

  return (
    <div ref={rootRef} className="fb-crumple" aria-hidden="true">
      <div ref={backdropRef} className="fb-crumple__backdrop" />
      <canvas ref={canvasRef} className="fb-crumple__canvas" />
    </div>
  );
}

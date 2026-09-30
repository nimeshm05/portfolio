/**
 * JellyEngine — a soft-body avatar rendered with raw WebGL2.
 *
 * The body is a surface of particles solved with position-based dynamics:
 * global shape matching (it always wants to become its rest shape again),
 * a volume constraint (squash bulges instead of shrinking) and light surface
 * springs (keeps the skin smooth). An anchor spring holds it in place, so it
 * can be pulled and thrown but always returns home. The camera is orthographic
 * and faces the body head-on.
 */

type Vec3 = [number, number, number];
type Quat = [number, number, number, number];

export type JellyEngineOptions = {
  canvas: HTMLCanvasElement;
  imageSrc: string;
  /** Layout size of the avatar in CSS px (the body's flat-to-flat width). The canvas may be larger, centred on it. */
  boxPx: number;
  onReady?: () => void;
  onError?: () => void;
};

// ---------- tuning ----------
const LON = 40;
const LAT = 28;
const STEP = 1 / 240;
const GRAVITY = 18;
const STIFF_REST = 0.03; // shape-matching pull per iteration
const STIFF_HELD = 0.012; // softer while held so it stretches
const JUMP_SPEED = 6.4;
const ANCHOR_K = 70; // spring back to home (x / z)
const ANCHOR_C = 7;
const MAX_RISE_SPEED = 7.8; // a little above a jump's launch speed
const DROP_START_SPEED = 9; // entrance drop is thrown down, not just released (faster fall, same gravity)
const DROP_BOUNCE_SPEED = 3.2; // rebound cap after the entrance drop (~12px bounce)
const MAX_RISE = 1.35; // highest the centre may travel (54px at 80px)
const HOLD_K = 160; // vertical pin while held
const HOLD_C = 14;
const MAX_PULL = 1.5; // world units the grabbed skin may travel (60px at 80px)
const GRAB_RADIUS = 0.85;
const DISC_R = 1; // diameter of exactly 2 units
const HALF_DEPTH = 0.6;
const ROUND = 0.26;

// ---------- small math ----------
function qmul(a: Quat, b: Quat): Quat {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}
function qnorm(q: Quat): Quat {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}
function qslerpToIdentity(a: Quat, t: number): Quat {
  // slerp(a, identity, t)
  let b: Quat = [0, 0, 0, 1];
  let d = a[3];
  if (d < 0) {
    b = [0, 0, 0, -1];
    d = -d;
  }
  if (d > 0.9995) {
    return qnorm([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]);
  }
  const th = Math.acos(d);
  const s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s;
  const wb = Math.sin(t * th) / s;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb, a[3] * wa + b[3] * wb];
}
/** Column-major 3x3 rotation matrix. */
function qmat(q: Quat): number[] {
  const [x, y, z, w] = q;
  return [
    1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w),
    2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w),
    2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y),
  ];
}

// ---------- the rest shape: a rounded, extruded disc ----------
function discSdf(): (x: number, y: number, z: number) => number {
  return (x, y, z) => {
    const wx = Math.hypot(x, y) - DISC_R + ROUND;
    const wy = Math.abs(z) - HALF_DEPTH + ROUND;
    return Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0)) - ROUND;
  };
}

// ---------- shaders ----------
const VS = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNrm;
layout(location=2) in vec2 aUv;
uniform mat4 uProj;
out vec3 vN; out vec2 vUv;
void main(){ vN = aNrm; vUv = aUv; gl_Position = uProj * vec4(aPos, 1.0); }`;

const FS = `#version 300 es
precision highp float;
in vec3 vN; in vec2 vUv;
uniform sampler2D uPhoto;
out vec4 o;
// soft studio: one large softbox up-left, a dim fill, and a floor bounce
vec3 studio(vec3 d){
  vec3 c = mix(vec3(.10,.10,.11), vec3(.55,.55,.57), smoothstep(-.4,.9,d.y));
  vec2 p = d.xy / max(d.z, .05) - vec2(-.55,.62);
  float box = (1.-smoothstep(.34,.40,abs(p.x))) * (1.-smoothstep(.20,.26,abs(p.y)));
  c += box * vec3(2.4);
  vec2 f = d.xy / max(d.z, .05) - vec2(.75,-.2);
  c += (1.-smoothstep(.1,.35,length(f))) * vec3(.35);
  return c;
}
void main(){
  vec3 N = normalize(vN);
  if(!gl_FrontFacing) N = -N;
  vec3 V = vec3(0.,0.,1.);
  vec3 L = normalize(vec3(-.45,.7,.6));
  vec3 base = texture(uPhoto, vUv).rgb;
  float nd = dot(N,L);
  float wrap = clamp((nd+.4)/1.4, 0., 1.);
  float facing = clamp(N.z, 0., 1.);
  // keep the photo true on the face, let the rounded rim fall off like gummy
  vec3 col = base * (0.80 + 0.26*wrap) * mix(.45, 1., smoothstep(0.,.75,facing));
  vec3 H = normalize(L+V);
  float nh = max(dot(N,H),0.);
  float spec = pow(nh, 140.)*1.6 + pow(nh, 18.)*.06;
  float fres = .04 + .96*pow(1.-facing, 5.);
  vec3 R = reflect(-V, N);
  col += studio(R) * (fres*.85 + .05) + spec;
  col = col / (1. + col*.12);
  o = vec4(pow(clamp(col,0.,1.), vec3(1./2.2)), 1.);
}`;

const VS_SHADOW = `#version 300 es
layout(location=0) in vec2 aQ;
uniform mat4 uProj; uniform vec4 uRect; // cx, cy, rx, ry
out vec2 vQ;
void main(){ vQ = aQ; gl_Position = uProj * vec4(uRect.xy + aQ*uRect.zw, -2.0, 1.0); }`;
const FS_SHADOW = `#version 300 es
precision mediump float;
in vec2 vQ; uniform float uAlpha; uniform vec3 uTint; out vec4 o;
void main(){ float a = uAlpha * (1. - smoothstep(0.2, 1., length(vQ))); o = vec4(uTint * a, a); }`;

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) throw new Error("shader");
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
    return sh;
  };
  const p = gl.createProgram();
  if (!p) throw new Error("program");
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

// ---------- engine ----------
export class JellyEngine {
  private readonly opts: JellyEngineOptions;
  private readonly gl: WebGL2RenderingContext;
  private readonly prog: WebGLProgram;
  private readonly shadowProg: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly shadowVao: WebGLVertexArrayObject;
  // redraw on theme change so the shadow strength follows it
  private readonly themeObserver = new MutationObserver(() => this.wake());
  private readonly vbo: WebGLBuffer;
  private readonly tex: WebGLTexture;
  private readonly indexCount: number;

  // mesh
  private readonly pid: Uint32Array; // render vertex -> particle
  private readonly interleaved: Float32Array;

  // physics
  private readonly N: number;
  private readonly q: Float32Array; // rest shape, centred
  private readonly x: Float32Array;
  private readonly v: Float32Array;
  private readonly p: Float32Array;
  private readonly grad: Float32Array;
  private readonly normals: Float32Array;
  private readonly contact: Uint8Array;
  private readonly tri: Uint32Array;
  private readonly edges: Uint32Array;
  private readonly edgeLen: Float32Array;
  private readonly V0: number;
  private readonly floorY: number;
  private rot: Quat = [0, 0, 0, 1];
  private grounded = true;
  private jumpCooldown = 0;
  private grab: { ids: number[]; w: number[]; wsum: number; target: Vec3; want: Vec3; hit: Vec3; from: [number, number] } | null = null;

  // loop
  private raf = 0;
  private last = 0;
  private acc = 0;
  private quiet = 0;
  private visible = true;
  private ready = false;
  private destroyed = false;
  private readonly unitsPerPx: number;
  private riseCap = MAX_RISE_SPEED;

  constructor(opts: JellyEngineOptions) {
    this.opts = opts;
    const gl = opts.canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;
    this.unitsPerPx = 2 / opts.boxPx;

    // --- sphere topology -> unique particles
    const rv = (LAT + 1) * (LON + 1);
        this.pid = new Uint32Array(rv);
    const dirs: number[][] = [];
    for (let iy = 0; iy <= LAT; iy++) {
      for (let ix = 0; ix <= LON; ix++) {
        const k = iy * (LON + 1) + ix;
        const u = ix / LON, vv = iy / LAT;
        const id = iy === 0 ? 0 : iy === LAT ? 1 + (LAT - 1) * LON : 1 + (iy - 1) * LON + (ix % LON);
        this.pid[k] = id;
        if (!dirs[id]) {
          const phi = vv * Math.PI, th = (u - 0.5) * 2 * Math.PI;
          dirs[id] = [Math.sin(phi) * Math.sin(th), Math.cos(phi), Math.sin(phi) * Math.cos(th)];
        }
      }
    }
    const N = (this.N = dirs.length);
    const index: number[] = [];
    for (let iy = 0; iy < LAT; iy++) {
      for (let ix = 0; ix < LON; ix++) {
        const a = iy * (LON + 1) + ix, b = a + LON + 1;
        if (iy !== 0) index.push(a, b, a + 1);
        if (iy !== LAT - 1) index.push(a + 1, b, b + 1);
      }
    }

    // --- project each direction onto the disc surface
    const sdf = discSdf();
    const q = (this.q = new Float32Array(N * 3));
    for (let i = 0; i < N; i++) {
      const [dx, dy, dz] = dirs[i];
      let lo = 0, hi = 0.05;
      while (hi < 4 && sdf(dx * hi, dy * hi, dz * hi) < 0) {
        lo = hi;
        hi += 0.05;
      }
      for (let k = 0; k < 24; k++) {
        const m = (lo + hi) / 2;
        if (sdf(dx * m, dy * m, dz * m) < 0) lo = m;
        else hi = m;
      }
      const r = (lo + hi) / 2;
      q[i * 3] = dx * r;
      q[i * 3 + 1] = dy * r;
      q[i * 3 + 2] = dz * r;
    }
    let my = 0;
    for (let i = 0; i < N; i++) my += q[i * 3 + 1];
    my /= N;
    let minY = Infinity;
    for (let i = 0; i < N; i++) {
      q[i * 3 + 1] -= my;
      minY = Math.min(minY, q[i * 3 + 1]);
    }
    this.floorY = minY;

    // --- triangles, edges, volume
    const tri: number[] = [];
    const edgeSet = new Set<number>();
    const edges: number[] = [];
    for (let t = 0; t < index.length; t += 3) {
      const a = this.pid[index[t]], b = this.pid[index[t + 1]], c = this.pid[index[t + 2]];
      if (a === b || b === c || a === c) continue;
      tri.push(a, b, c);
      for (const [m, n] of [[a, b], [b, c], [c, a]]) {
        const lo = Math.min(m, n), hi = Math.max(m, n), key = lo * 65536 + hi;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push(lo, hi);
        }
      }
    }
    this.tri = new Uint32Array(tri);
    this.edges = new Uint32Array(edges);
    this.edgeLen = new Float32Array(edges.length / 2);
    for (let e = 0; e < this.edgeLen.length; e++) {
      const a = this.edges[e * 2] * 3, b = this.edges[e * 2 + 1] * 3;
      this.edgeLen[e] = Math.hypot(q[b] - q[a], q[b + 1] - q[a + 1], q[b + 2] - q[a + 2]);
    }
    let V0 = 0;
    for (let t = 0; t < this.tri.length; t += 3) {
      const a = this.tri[t] * 3, b = this.tri[t + 1] * 3, c = this.tri[t + 2] * 3;
      V0 += (q[a] * (q[b + 1] * q[c + 2] - q[b + 2] * q[c + 1]) - q[a + 1] * (q[b] * q[c + 2] - q[b + 2] * q[c]) + q[a + 2] * (q[b] * q[c + 1] - q[b + 1] * q[c])) / 6;
    }
    this.V0 = V0;

    this.x = q.slice();
    this.v = new Float32Array(N * 3);
    this.p = new Float32Array(N * 3);
    this.grad = new Float32Array(N * 3);
    this.normals = new Float32Array(N * 3);
    this.contact = new Uint8Array(N);

    // --- photo UVs: planar projection of the rest shape, square photo over the 2x2 face
    const uv = new Float32Array(rv * 2);
    for (let k = 0; k < rv; k++) {
      const i = this.pid[k] * 3;
      uv[k * 2] = (q[i] + 1) / 2;
      uv[k * 2 + 1] = 1 - (q[i + 1] - this.floorY) / 2;
    }

    // --- GL objects
    this.prog = compile(gl, VS, FS);
    this.shadowProg = compile(gl, VS_SHADOW, FS_SHADOW);
    this.interleaved = new Float32Array(rv * 6);
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    const ubo = gl.createBuffer();
    const ibo = gl.createBuffer();
    const tex = gl.createTexture();
    const svao = gl.createVertexArray();
    const sbo = gl.createBuffer();
    if (!vao || !vbo || !ubo || !ibo || !tex || !svao || !sbo) throw new Error("gl alloc");
    this.vao = vao;
    this.vbo = vbo;
    this.tex = tex;
    this.shadowVao = svao;
    this.themeObserver.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.interleaved, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.bindBuffer(gl.ARRAY_BUFFER, ubo);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
    this.indexCount = index.length;
    gl.bindVertexArray(svao);
    gl.bindBuffer(gl.ARRAY_BUFFER, sbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    this.resize();
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (this.destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.ready = true;
      this.render();
      opts.onReady?.();
    };
    img.onerror = () => opts.onError?.();
    img.src = opts.imageSrc;
  }

  // ---------- public API ----------
  /** Match the drawing buffer to the canvas' CSS size. */
  resize() {
    const c = this.opts.canvas;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr);
    if (w && h && (c.width !== w || c.height !== h)) {
      c.width = w;
      c.height = h;
    }
    if (this.ready) this.render();
  }

  /** Start pulling at a screen point. Returns false when the point misses the body. */
  grabAt(clientX: number, clientY: number): boolean {
    const [wx, wy] = this.toWorld(clientX, clientY);
    const x = this.x;
    let best = -1, bd = Infinity;
    for (let i = 0; i < this.N; i++) {
      if (x[i * 3 + 2] < 0.1) continue; // front skin only
      const dx = x[i * 3] - wx, dy = x[i * 3 + 1] - wy, d = dx * dx + dy * dy;
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    if (best < 0 || bd > 0.5) return false;
    const hx = x[best * 3], hy = x[best * 3 + 1], hz = x[best * 3 + 2];
    const ids: number[] = [], w: number[] = [];
    for (let i = 0; i < this.N; i++) {
      const d = Math.hypot(x[i * 3] - hx, x[i * 3 + 1] - hy, x[i * 3 + 2] - hz);
      if (d < GRAB_RADIUS) {
        const t = 1 - d / GRAB_RADIUS;
        ids.push(i);
        w.push(t * t * (3 - 2 * t));
      }
    }
    this.riseCap = MAX_RISE_SPEED;
    this.grab = { ids, w, wsum: w.reduce((a, b) => a + b, 0), target: [hx, hy, hz], want: [hx, hy, hz], hit: [hx, hy, hz], from: [wx, wy] };
    this.wake();
    return true;
  }

  dragTo(clientX: number, clientY: number) {
    const g = this.grab;
    if (!g) return;
    const [wx, wy] = this.toWorld(clientX, clientY);
    // follow the pointer relative to where the skin was picked up, within reach of home
    let dx = wx - g.from[0], dy = wy - g.from[1];
    const l = Math.hypot(dx, dy);
    if (l > MAX_PULL) {
      dx *= MAX_PULL / l;
      dy *= MAX_PULL / l;
    }
    g.want = [g.hit[0] + dx, g.hit[1] + dy, g.hit[2]];
    this.wake();
  }

  release() {
    this.grab = null;
    this.wake();
  }

  jump() {
    if (this.jumpCooldown > 0 || this.grab) return;
    let ymin = Infinity;
    for (let i = 0; i < this.N; i++) ymin = Math.min(ymin, this.x[i * 3 + 1]);
    // forgiving: counts as on the floor while it is still wobbling close to it
    if (ymin - this.floorY > 0.12) return;
    let vy = 0;
    for (let i = 0; i < this.N; i++) vy += this.v[i * 3 + 1];
    vy /= this.N;
    for (let i = 0; i < this.N; i++) {
      const low = 1 - Math.min(1, (this.x[i * 3 + 1] - ymin) / 2);
      this.v[i * 3 + 1] += JUMP_SPEED * (0.8 + 0.4 * low) - Math.max(0, vy);
    }
    this.jumpCooldown = 0.25;
    this.grounded = false;
    this.riseCap = MAX_RISE_SPEED;
    this.wake();
  }

  /** Entrance: place the body just above the canvas' top edge and let it fall home, bouncing a little. */
  dropIn() {
    const { x, q, v } = this;
    const lift = this.homePx()[1] * this.unitsPerPx + 1.1;
    for (let i = 0; i < this.N; i++) {
      x[i * 3] = q[i * 3];
      x[i * 3 + 1] = q[i * 3 + 1] + lift;
      x[i * 3 + 2] = q[i * 3 + 2];
    }
    v.fill(0);
    for (let i = 0; i < this.N; i++) v[i * 3 + 1] = -DROP_START_SPEED;
    this.rot = [0, 0, 0, 1];
    this.grab = null;
    this.grounded = false;
    this.riseCap = DROP_BOUNCE_SPEED;
    this.render();
    this.wake();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.wake();
    else this.stop();
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    this.themeObserver.disconnect();
    const gl = this.gl;
    gl.deleteTexture(this.tex);
    gl.deleteProgram(this.prog);
    gl.deleteProgram(this.shadowProg);
  }

  // ---------- loop ----------
  private wake() {
    this.quiet = 0;
    if (this.raf || !this.visible || this.destroyed) return;
    this.last = performance.now();
    this.acc = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (this.grab) {
      const g = this.grab, k = 1 - Math.exp(-dt * 30);
      for (let i = 0; i < 3; i++) g.target[i] += (g.want[i] - g.target[i]) * k;
    }
    this.acc += dt;
    let n = 0;
    while (this.acc >= STEP && n < 8) {
      this.step(STEP);
      this.acc -= STEP;
      n++;
    }
    if (n === 8) this.acc = 0;
    this.render();
    // sleep once everything has settled
    let e = 0;
    for (let i = 0; i < this.v.length; i++) e += this.v[i] * this.v[i];
    this.quiet = !this.grab && this.grounded && e / this.N < 4e-4 ? this.quiet + dt : 0;
    if (this.quiet > 0.6 || !this.visible) return;
    this.raf = requestAnimationFrame(this.frame);
  };

  private toWorld(clientX: number, clientY: number): [number, number] {
    const r = this.opts.canvas.getBoundingClientRect(), [hx, hy] = this.homePx();
    return [(clientX - (r.left + hx)) * this.unitsPerPx, -(clientY - (r.top + hy)) * this.unitsPerPx];
  }

  /** Home (the avatar box's centre) in canvas CSS px. The canvas is positioned against the box. */
  private homePx(): [number, number] {
    const c = this.opts.canvas, half = this.opts.boxPx / 2;
    return [half - c.offsetLeft, half - c.offsetTop];
  }

  // ---------- physics ----------
  private step(h: number) {
    const { N, x, v, p } = this;
    this.jumpCooldown -= h;
    let cx = 0, cy = 0, cz = 0, vx = 0, vy = 0, vz = 0;
    for (let i = 0; i < N; i++) {
      cx += x[i * 3];
      cy += x[i * 3 + 1];
      cz += x[i * 3 + 2];
      vx += v[i * 3];
      vy += v[i * 3 + 1];
      vz += v[i * 3 + 2];
    }
    cx /= N; cy /= N; cz /= N; vx /= N; vy /= N; vz /= N;
    const held = !!this.grab;
    // anchor home: sideways always; while held the whole body is pinned so the pull stretches it
    const ax = (-ANCHOR_K * cx - ANCHOR_C * vx) * h;
    const az = (-ANCHOR_K * cz - ANCHOR_C * vz) * h;
    const ay = held ? (-HOLD_K * cy - HOLD_C * vy) * h : -GRAVITY * h;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      v[j] += ax;
      v[j + 1] += ay;
      v[j + 2] += az;
      p[j] = x[j] + v[j] * h;
      p[j + 1] = x[j + 1] + v[j + 1] * h;
      p[j + 2] = x[j + 2] + v[j + 2] * h;
    }
    this.contact.fill(0);
    const upright = held ? 0.05 : this.grounded ? 0.12 : 0.05;
    const stiff = held ? STIFF_HELD : STIFF_REST;
    for (let it = 0; it < 2; it++) {
      this.shapeMatch(stiff, upright);
      this.volume(0.9);
      this.springs(0.05);
      this.solveGrab();
      // the floor only matters for jumping; while held the jelly may be pulled below it,
      // and on release it is eased back up instead of snapping
      if (!held) {
        for (let i = 0; i < N; i++) {
          if (p[i * 3 + 1] < this.floorY) {
            p[i * 3 + 1] += (this.floorY - p[i * 3 + 1]) * 0.5;
            this.contact[i] = 1;
          }
        }
      }
    }
    let contacts = 0;
    for (let i = 0; i < N; i++) {
      if (!this.contact[i]) continue;
      contacts++;
      const j = i * 3;
      p[j] -= (p[j] - x[j]) * 0.4;
      p[j + 2] -= (p[j + 2] - x[j + 2]) * 0.4;
    }
    this.grounded = contacts > 3;
    let mx = 0, my = 0, mz = 0;
    const damp = Math.exp(-(this.grab ? 5 : 7.5) * h);
    for (let i = 0; i < N * 3; i++) v[i] = (p[i] - x[i]) / h;
    for (let i = 0; i < N; i++) {
      mx += v[i * 3];
      my += v[i * 3 + 1];
      mz += v[i * 3 + 2];
    }
    mx /= N; my /= N; mz /= N;
    // keep a released pull from flinging the body out of its canvas
    let py = 0;
    for (let i = 0; i < N; i++) py += p[i * 3 + 1];
    py /= N;
    let limY = my;
    if (!held) {
      if (limY > this.riseCap) limY = this.riseCap;
      if (py > MAX_RISE && limY > 0) limY = 0;
    }
    const shiftY = limY - my;
    my = limY;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      v[j + 1] += shiftY;
      v[j] = mx + (v[j] - mx) * damp;
      v[j + 1] = my + (v[j + 1] - my) * damp;
      v[j + 2] = mz + (v[j + 2] - mz) * damp;
      x[j] = p[j];
      x[j + 1] = p[j + 1];
      x[j + 2] = p[j + 2];
    }
  }

  private shapeMatch(alpha: number, upright: number) {
    const { N, p, q } = this;
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < N; i++) {
      cx += p[i * 3];
      cy += p[i * 3 + 1];
      cz += p[i * 3 + 2];
    }
    cx /= N; cy /= N; cz /= N;
    let a00 = 0, a01 = 0, a02 = 0, a10 = 0, a11 = 0, a12 = 0, a20 = 0, a21 = 0, a22 = 0;
    for (let i = 0; i < N; i++) {
      const j = i * 3, dx = p[j] - cx, dy = p[j + 1] - cy, dz = p[j + 2] - cz, qx = q[j], qy = q[j + 1], qz = q[j + 2];
      a00 += dx * qx; a01 += dx * qy; a02 += dx * qz;
      a10 += dy * qx; a11 += dy * qy; a12 += dy * qz;
      a20 += dz * qx; a21 += dz * qy; a22 += dz * qz;
    }
    // rotational part of the deformation (Müller et al. 2016), warm-started
    let r = this.rot;
    for (let it = 0; it < 6; it++) {
      const m = qmat(r);
      const wx = m[1] * a20 - m[2] * a10 + (m[4] * a21 - m[5] * a11) + (m[7] * a22 - m[8] * a12);
      const wy = m[2] * a00 - m[0] * a20 + (m[5] * a01 - m[3] * a21) + (m[8] * a02 - m[6] * a22);
      const wz = m[0] * a10 - m[1] * a00 + (m[3] * a11 - m[4] * a01) + (m[6] * a12 - m[7] * a02);
      const den = Math.abs(m[0] * a00 + m[1] * a10 + m[2] * a20 + m[3] * a01 + m[4] * a11 + m[5] * a21 + m[6] * a02 + m[7] * a12 + m[8] * a22) + 1e-9;
      const ox = wx / den, oy = wy / den, oz = wz / den, w = Math.hypot(ox, oy, oz);
      if (w < 1e-9) break;
      const s = Math.sin(w / 2) / w;
      r = qnorm(qmul([ox * s, oy * s, oz * s, Math.cos(w / 2)], r));
    }
    this.rot = r;
    const m = qmat(qslerpToIdentity(r, upright)); // always turn back to face the viewer
    for (let i = 0; i < N; i++) {
      const j = i * 3, qx = q[j], qy = q[j + 1], qz = q[j + 2];
      p[j] += (cx + m[0] * qx + m[3] * qy + m[6] * qz - p[j]) * alpha;
      p[j + 1] += (cy + m[1] * qx + m[4] * qy + m[7] * qz - p[j + 1]) * alpha;
      p[j + 2] += (cz + m[2] * qx + m[5] * qy + m[8] * qz - p[j + 2]) * alpha;
    }
  }

  private volume(k: number) {
    const { p, grad, tri } = this;
    grad.fill(0);
    let V = 0;
    for (let t = 0; t < tri.length; t += 3) {
      const a = tri[t] * 3, b = tri[t + 1] * 3, c = tri[t + 2] * 3;
      const ax = p[a], ay = p[a + 1], az = p[a + 2], bx = p[b], by = p[b + 1], bz = p[b + 2], cx = p[c], cy = p[c + 1], cz = p[c + 2];
      V += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
      grad[a] += (by * cz - bz * cy) / 6; grad[a + 1] += (bz * cx - bx * cz) / 6; grad[a + 2] += (bx * cy - by * cx) / 6;
      grad[b] += (cy * az - cz * ay) / 6; grad[b + 1] += (cz * ax - cx * az) / 6; grad[b + 2] += (cx * ay - cy * ax) / 6;
      grad[c] += (ay * bz - az * by) / 6; grad[c + 1] += (az * bx - ax * bz) / 6; grad[c + 2] += (ax * by - ay * bx) / 6;
    }
    let s = 0;
    for (let i = 0; i < grad.length; i++) s += grad[i] * grad[i];
    if (s < 1e-12) return;
    const lam = (k * (this.V0 - V)) / s;
    for (let i = 0; i < grad.length; i++) p[i] += lam * grad[i];
  }

  private springs(k: number) {
    const { p, edges, edgeLen } = this;
    for (let e = 0; e < edgeLen.length; e++) {
      const a = edges[e * 2] * 3, b = edges[e * 2 + 1] * 3;
      const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
      const l = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (l < 1e-6) continue;
      const c = ((l - edgeLen[e]) / l) * 0.5 * k;
      p[a] += dx * c; p[a + 1] += dy * c; p[a + 2] += dz * c;
      p[b] -= dx * c; p[b + 1] -= dy * c; p[b + 2] -= dz * c;
    }
  }

  private solveGrab() {
    const g = this.grab;
    if (!g) return;
    const p = this.p;
    let ax = 0, ay = 0;
    for (let n = 0; n < g.ids.length; n++) {
      const j = g.ids[n] * 3, w = g.w[n] / g.wsum;
      ax += p[j] * w;
      ay += p[j + 1] * w;
    }
    const dx = g.target[0] - ax, dy = g.target[1] - ay;
    for (let n = 0; n < g.ids.length; n++) {
      const j = g.ids[n] * 3, w = g.w[n] * 0.45;
      p[j] += dx * w;
      p[j + 1] += dy * w;
    }
  }

  // ---------- drawing ----------
  private render() {
    if (!this.ready) return;
    const { gl, x, normals, tri, N } = this;
    normals.fill(0);
    for (let t = 0; t < tri.length; t += 3) {
      const a = tri[t] * 3, b = tri[t + 1] * 3, c = tri[t + 2] * 3;
      const ux = x[b] - x[a], uy = x[b + 1] - x[a + 1], uz = x[b + 2] - x[a + 2];
      const wx = x[c] - x[a], wy = x[c + 1] - x[a + 1], wz = x[c + 2] - x[a + 2];
      const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
      normals[a] += nx; normals[a + 1] += ny; normals[a + 2] += nz;
      normals[b] += nx; normals[b + 1] += ny; normals[b + 2] += nz;
      normals[c] += nx; normals[c + 1] += ny; normals[c + 2] += nz;
    }
    let minY = Infinity, x0 = Infinity, x1 = -Infinity;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const l = Math.sqrt(normals[j] * normals[j] + normals[j + 1] * normals[j + 1] + normals[j + 2] * normals[j + 2]) || 1;
      normals[j] /= l; normals[j + 1] /= l; normals[j + 2] /= l;
      minY = Math.min(minY, x[j + 1]);
      x0 = Math.min(x0, x[j]);
      x1 = Math.max(x1, x[j]);
    }
    const out = this.interleaved, pid = this.pid;
    for (let k = 0; k < pid.length; k++) {
      const i = pid[k] * 3, o = k * 6;
      out[o] = x[i]; out[o + 1] = x[i + 1]; out[o + 2] = x[i + 2];
      out[o + 3] = normals[i]; out[o + 4] = normals[i + 1]; out[o + 5] = normals[i + 2];
    }

    const c = this.opts.canvas;
    const W = c.clientWidth, H = c.clientHeight, [hx, hy] = this.homePx();
    // orthographic, looking straight down -z; home sits at the avatar box's centre (the canvas may overhang unevenly)
    const sx = 2 / (W * this.unitsPerPx), sy = 2 / (H * this.unitsPerPx);
    const proj = new Float32Array([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, -0.1, 0, (2 * hx) / W - 1, 1 - (2 * hy) / H, 0, 1]);
    gl.viewport(0, 0, c.width, c.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // contact shadow: shrinks and fades as the body leaves the floor; a soft white glow on a dark page
    const dark = document.documentElement.dataset.theme === "dark";
    const lift = Math.max(0, minY - this.floorY);
    const fade = Math.max(0, 1 - lift / 1.6);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.shadowProg);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shadowProg, "uProj"), false, proj);
    gl.uniform4f(gl.getUniformLocation(this.shadowProg, "uRect"), (x0 + x1) / 2, this.floorY + 0.02, ((x1 - x0) / 2) * (0.75 + 0.2 * fade), 0.13);
    gl.uniform1f(gl.getUniformLocation(this.shadowProg, "uAlpha"), (dark ? 0.16 : 0.22) * fade * fade);
    gl.uniform3f(gl.getUniformLocation(this.shadowProg, "uTint"), dark ? 1 : 0, dark ? 1 : 0, dark ? 1 : 0);
    gl.bindVertexArray(this.shadowVao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.prog, "uProj"), false, proj);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(gl.getUniformLocation(this.prog, "uPhoto"), 0);
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, out);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

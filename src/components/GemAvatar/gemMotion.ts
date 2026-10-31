/**
 * Motion for the gem avatar: a tiny, dependency-free animation loop.
 *
 * Units are SVG viewBox units: the body is a sphere of radius 100 centred on
 * the origin, so the 200-unit viewBox maps onto the avatar's layout box.
 * +y points down (SVG), so a hop is a negative y.
 */

export const BODY_R = 100;

/** Where the eyes sit on the sphere when facing forward (radians). */
const EYE_YAW = 0.34;
const EYE_PITCH = -0.2;
const EYE_HALF_W = 9.5;
const EYE_HALF_H = 18;

/** A pill (stadium) centred on the origin; transformed onto the sphere per frame. */
export const EYE_PATH = `M${-EYE_HALF_W} ${EYE_HALF_W - EYE_HALF_H}A${EYE_HALF_W} ${EYE_HALF_W} 0 0 1 ${EYE_HALF_W} ${EYE_HALF_W - EYE_HALF_H}L${EYE_HALF_W} ${EYE_HALF_H - EYE_HALF_W}A${EYE_HALF_W} ${EYE_HALF_W} 0 0 1 ${-EYE_HALF_W} ${EYE_HALF_H - EYE_HALF_W}Z`;

// ---- tuning --------------------------------------------------------------

/** Fall acceleration (units/s²). */
const GRAVITY = 3200;
/** Hop heights (units; 100 units ≈ half the avatar). */
const HOP_CLICK = 70;
const HOP_IDLE = 22;
const HOP_TURN = 34;
/** Cap on the bounce after the entrance drop (units). */
const DROP_BOUNCE = 30;
/** Landing → squash. */
const SQUASH_PER_IMPACT = 0.004;
const SQUASH_K = 260;
const SQUASH_C = 11;
/** Squash while pressed (anticipation before the hop). */
const SQUASH_PRESSED = 0.14;
/** Facing spring: a touch underdamped so glances settle with a little overshoot. */
const FACE_K = 90;
const FACE_C = 13;
/** How far it turns to follow the pointer (radians). */
const LOOK_YAW = 0.6;
const LOOK_PITCH = 0.42;
/** Pointer distance (px) at which the look is at its maximum. */
const LOOK_REACH_PX = 360;
/** Without pointer movement for this long it starts looking around on its own. */
const POINTER_IDLE_S = 2.5;

// ---- frame -----------------------------------------------------------------

export type GemFrame = {
  /** Height above the ground (units, negative = up). */
  y: number;
  /** + flattened, − stretched. */
  squash: number;
  yaw: number;
  pitch: number;
  roll: number;
  openL: number;
  openR: number;
  eyeScale: number;
};

export const REST_FRAME: GemFrame = { y: 0, squash: 0, yaw: 0, pitch: 0, roll: 0, openL: 1, openR: 1, eyeScale: 1 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (k: number) => k * k * (3 - 2 * k);
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
/** 0 → 1 → 0 over k, with quick edges and a held middle. */
const hold = (k: number, inEnd: number, outStart: number) =>
  k < inEnd ? smooth(k / inEnd) : k < outStart ? 1 : 1 - smooth((k - outStart) / (1 - outStart));

/** Body squash/stretch, pivoting on the point where it touches the ground. */
export function bodyTransform(f: GemFrame) {
  const sy = 1 - f.squash;
  const sx = 1 + f.squash * 0.9;
  return `translate(0 ${(f.y + BODY_R).toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 ${-BODY_R})`;
}

/** Ground shadow shrinks and fades as the body lifts. */
export function shadowScale(f: GemFrame) {
  return 1 / (1 + Math.max(0, -f.y) / 160);
}

/**
 * One eye painted on the sphere's surface: its centre and local axes are
 * rotated with the body (yaw → pitch → roll) and projected straight on, so it
 * foreshortens towards the rim and disappears round the back.
 */
export function eyeTransform(side: -1 | 1, f: GemFrame) {
  const a = side * EYE_YAW;
  const b = EYE_PITCH;
  const open = side < 0 ? f.openL : f.openR;
  const s = f.eyeScale;

  const rotate = (x: number, y: number, z: number) => {
    // yaw (around y)
    const cy = Math.cos(f.yaw), sy = Math.sin(f.yaw);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    // pitch (around x): positive looks down
    const cp = Math.cos(f.pitch), sp = Math.sin(f.pitch);
    const y2 = y * cp + z1 * sp;
    const z2 = -y * sp + z1 * cp;
    // roll (in the picture plane)
    const cr = Math.cos(f.roll), sr = Math.sin(f.roll);
    return [x1 * cr - y2 * sr, x1 * sr + y2 * cr, z2] as const;
  };

  const d = rotate(Math.sin(a) * Math.cos(b), Math.sin(b), Math.cos(a) * Math.cos(b));
  const u = rotate(Math.cos(a), 0, -Math.sin(a));
  const v = rotate(-Math.sin(a) * Math.sin(b), Math.cos(b), -Math.cos(a) * Math.sin(b));

  const m = [u[0] * s, u[1] * s, v[0] * s * open, v[1] * s * open, d[0] * BODY_R, d[1] * BODY_R];
  return {
    matrix: `matrix(${m.map((n) => n.toFixed(4)).join(" ")})`,
    opacity: clamp((d[2] - 0.02) / 0.2, 0, 1),
  };
}

// ---- engine ----------------------------------------------------------------

type Effect = { start: number; dur: number; apply: (k: number, f: GemFrame) => void };
type Look = { yaw: number; pitch: number };

/** Eye closure curve for a blink: fast close, slightly slower open. */
const blinkCurve = (k: number) => (k < 0.4 ? smooth(k / 0.4) : 1 - smooth((k - 0.4) / 0.6));

export class GemMotion {
  private time = 0;
  private last = 0;
  private raf = 0;
  private visible = true;
  private started = false;

  private y = 0;
  private vy = 0;
  private airborne = false;
  private bounceCap = Infinity;
  private squash = 0;
  private squashV = 0;
  private pressed = false;

  private face = { yaw: 0, pitch: 0 };
  private faceV = { yaw: 0, pitch: 0 };
  private pointerLook: Look | null = null;
  private pointerAt = -Infinity;
  private idleLook: Look = { yaw: 0, pitch: 0 };

  private effects: Effect[] = [];
  private busyUntil = 0; // a turn-around or wink is playing
  private nextIdleAt = rand(1.8, 3);
  private nextBlinkAt = rand(1.2, 2.5);
  private clicks = 0;

  constructor(private readonly paint: (f: GemFrame) => void) {}

  /** Starts the loop. With `dropFrom` (units above the ground) it falls in and bounces. */
  start(dropFrom = 0) {
    if (this.started) return;
    this.started = true;
    if (dropFrom > 0) {
      this.y = -dropFrom;
      this.vy = 0;
      this.airborne = true;
      this.bounceCap = Math.sqrt(2 * GRAVITY * DROP_BOUNCE);
      this.nextIdleAt = 1.4;
    }
    this.schedule();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.schedule();
  }

  /** Pointer position relative to the avatar's centre, in px. */
  lookAtPointer(dx: number, dy: number) {
    this.pointerLook = {
      yaw: clamp(dx / LOOK_REACH_PX, -1, 1) * LOOK_YAW,
      pitch: clamp(dy / LOOK_REACH_PX, -1, 1) * LOOK_PITCH,
    };
    this.pointerAt = this.time;
  }

  forgetPointer() {
    this.pointerLook = null;
  }

  press() {
    this.pressed = true;
  }

  /** Release after a press, or keyboard activation: a hop with a rotating reaction. */
  release(activate = true) {
    this.pressed = false;
    if (!activate) return;
    const reaction = this.clicks++ % 3;
    if (reaction === 1) this.turnAround();
    else {
      this.hop(HOP_CLICK);
      if (reaction === 0) this.wideEyes();
      else this.wink(Math.random() < 0.5 ? -1 : 1);
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.started = false;
  }

  // ---- actions ----

  private hop(height: number) {
    if (this.y < -12) return; // already well off the ground
    this.vy = -Math.sqrt(2 * GRAVITY * height);
    this.airborne = true;
    this.bounceCap = Infinity;
  }

  private play(dur: number, apply: Effect["apply"]) {
    this.effects.push({ start: this.time, dur, apply });
  }

  private blink(which: "both" | -1 | 1 = "both") {
    this.play(0.17, (k, f) => {
      const c = 1 - 0.94 * blinkCurve(k);
      if (which !== 1) f.openL *= c;
      if (which !== -1) f.openR *= c;
    });
  }

  private wink(side: -1 | 1) {
    this.busyUntil = this.time + 0.75;
    this.play(0.75, (k, f) => {
      const c = hold(k, 0.15, 0.7);
      if (side < 0) {
        f.openL *= 1 - 0.94 * c;
        f.openR *= 1 - 0.12 * c;
      } else {
        f.openR *= 1 - 0.94 * c;
        f.openL *= 1 - 0.12 * c;
      }
      f.roll += side * 0.13 * c; // tips its head towards the wink
    });
  }

  private wideEyes() {
    this.play(1, (k, f) => {
      f.eyeScale *= 1 + 0.28 * hold(k, 0.12, 0.65);
    });
  }

  /** A full spin about the vertical axis with a little hop: the face slides round the back and comes back. */
  private turnAround() {
    const dir = Math.random() < 0.5 ? -1 : 1;
    this.busyUntil = this.time + 1.25;
    this.hop(HOP_TURN);
    this.play(1.15, (k, f) => {
      f.yaw += dir * Math.PI * 2 * easeInOut(k);
    });
    this.play(1.25, (k, f) => {
      // a quick blink once the face is back round the front
      if (k > 0.82) {
        const c = 1 - 0.94 * blinkCurve((k - 0.82) / 0.18);
        f.openL *= c;
        f.openR *= c;
      }
    });
  }

  private idle() {
    this.nextIdleAt = this.time + rand(2.2, 4.6);
    if (this.airborne || this.time < this.busyUntil) return;
    const lookingAround = this.time - this.pointerAt > POINTER_IDLE_S;
    const roll = Math.random();
    if (roll < 0.42) {
      if (lookingAround) this.idleLook = { yaw: rand(-0.55, 0.55), pitch: rand(-0.3, 0.35) };
      else this.blink();
    } else if (roll < 0.55) {
      this.idleLook = { yaw: 0, pitch: 0 };
      this.hop(HOP_IDLE);
    } else if (roll < 0.7) {
      this.wink(Math.random() < 0.5 ? -1 : 1);
    } else if (roll < 0.8) {
      this.turnAround();
    } else if (roll < 0.9) {
      // two little bounces
      this.hop(HOP_IDLE);
      window.setTimeout(() => this.hop(HOP_IDLE * 0.7), 330);
    } else {
      this.wideEyes();
    }
  }

  // ---- loop ----

  private schedule() {
    if (this.raf || !this.started || !this.visible) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (!this.started || !this.visible) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    // small fixed sub-steps keep the springs stable on slow frames
    const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    for (let i = 0; i < steps; i++) this.step(dt / steps);
    this.paint(this.compose());
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(h: number) {
    this.time += h;

    if (this.time >= this.nextBlinkAt) {
      this.nextBlinkAt = this.time + rand(2.6, 5.5);
      if (this.time >= this.busyUntil) {
        this.blink();
        if (Math.random() < 0.2) window.setTimeout(() => this.blink(), 230);
      }
    }
    if (this.time >= this.nextIdleAt) this.idle();

    // vertical: gravity, landing, bounce
    if (this.airborne) {
      this.vy += GRAVITY * h;
      this.y += this.vy * h;
      if (this.y >= 0 && this.vy > 0) {
        const impact = this.vy;
        this.y = 0;
        this.squashV += Math.min(impact, 700) * SQUASH_PER_IMPACT;
        if (impact > 380) {
          this.vy = -Math.min(impact * 0.3, this.bounceCap);
          this.bounceCap = Infinity;
        } else {
          this.vy = 0;
          this.airborne = false;
        }
      }
    }

    const squashTarget = this.airborne ? -Math.min(0.1, Math.abs(this.vy) / 7000) : this.pressed ? SQUASH_PRESSED : 0;
    this.squashV += (-SQUASH_K * (this.squash - squashTarget) - SQUASH_C * this.squashV) * h;
    this.squash += this.squashV * h;

    const pointerActive = this.pointerLook && this.time - this.pointerAt <= POINTER_IDLE_S;
    const target = pointerActive ? this.pointerLook! : this.idleLook;
    for (const axis of ["yaw", "pitch"] as const) {
      this.faceV[axis] += (-FACE_K * (this.face[axis] - target[axis]) - FACE_C * this.faceV[axis]) * h;
      this.face[axis] += this.faceV[axis] * h;
    }

    this.effects = this.effects.filter((e) => this.time - e.start < e.dur);
  }

  private compose(): GemFrame {
    const f: GemFrame = { ...REST_FRAME, y: this.y, squash: this.squash, yaw: this.face.yaw, pitch: this.face.pitch };
    for (const e of this.effects) e.apply(clamp((this.time - e.start) / e.dur, 0, 1), f);
    return f;
  }
}

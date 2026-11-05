/*
 * Photo book sounds, synthesized live with Web Audio (no audio files), like
 * the site's other interaction sounds: soft sweeps of filtered noise, the air
 * a swinging page pushes. No clicks or thumps, only the sweep.
 *
 * Every function takes the same timings the book animates with, so each
 * sweep spans its page's swing.
 */

/** Phones and tablets stay quiet, same as ClickSound. */
const TOUCH_DEVICE_QUERY = "(hover: none) and (pointer: coarse)";

/** Overall loudness; each layer's peak below is relative to this. */
const MASTER_VOLUME = 0.35;

/** Where in a turn the page lands; the turn ease settles late. */
const LAND_AT = 0.78;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (window.matchMedia(TOUCH_DEVICE_QUERY).matches) return null;
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
    master = context.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(context.destination);
    // Two seconds of white noise, reused from random offsets.
    const length = context.sampleRate * 2;
    noise = context.createBuffer(1, length, context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (context.state === "suspended") void context.resume();
  return { ctx: context, out: master!, buffer: noise! };
}

/** ±spread around 1, so repeated turns never sound identical. */
const vary = (spread: number) => 1 + (Math.random() * 2 - 1) * spread;

type Rig = NonNullable<ReturnType<typeof audio>>;

type Burst = {
  /** Seconds from now */
  at: number;
  filter: BiquadFilterType;
  frequency: number;
  /** Optional sweep: [frequency, seconds after `at`] points */
  sweep?: [number, number][];
  q?: number;
  peak: number;
  attack: number;
  decay: number;
};

/** One shaped burst of filtered noise. */
function burst({ ctx, out, buffer }: Rig, b: Burst) {
  const start = ctx.currentTime + b.at;
  const length = b.attack + b.decay;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = b.filter;
  filter.frequency.setValueAtTime(b.frequency, start);
  for (const [frequency, time] of b.sweep ?? []) {
    filter.frequency.exponentialRampToValueAtTime(frequency, start + time);
  }
  filter.Q.value = b.q ?? 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(b.peak, start + b.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  source.connect(filter).connect(gain).connect(out);
  source.start(start, Math.random() * (buffer.duration - length - 0.1));
  source.stop(start + length + 0.05);
}

/** The air a swinging page pushes: a band of noise that rises then falls. */
function swish(a: Rig, at: number, seconds: number, low: number, peak: number) {
  const base = low * vary(0.12);
  burst(a, {
    at,
    filter: "bandpass",
    frequency: base,
    sweep: [
      [base * 2.6, seconds * 0.5],
      [base * 1.6, seconds * LAND_AT],
    ],
    q: 0.6,
    peak: peak * vary(0.15),
    attack: seconds * 0.45,
    decay: seconds * (LAND_AT - 0.45) + 0.05,
  });
}

/**
 * One turn of the book, from `from` leaves turned to `to`.
 * `turnMs` and `staggerMs` are the book's own animation timings; `quick`
 * is the reduced-motion crossfade, which has no swing to follow.
 */
export function playBookTurn({
  from,
  to,
  turnMs,
  staggerMs,
  quick = false,
}: {
  from: number;
  to: number;
  turnMs: number;
  staggerMs: number;
  quick?: boolean;
}) {
  const a = audio();
  if (!a || from === to) return;

  if (quick) {
    swish(a, 0, 0.3, 1100, 0.35);
    return;
  }

  const seconds = turnMs / 1000;

  // Opening: the heavier cover moves more air, so it sits lower.
  if (from === 0) {
    swish(a, 0, seconds, 520, 0.5);
    return;
  }

  // One page, either way.
  if (Math.abs(to - from) === 1 && to !== 0) {
    swish(a, 0, seconds, 900, 0.55);
    return;
  }

  // Closing: one long sweep across the whole staggered fall of the leaves.
  const leaves = from - to;
  swish(a, 0, seconds + (staggerMs / 1000) * (leaves - 1), 600, 0.6);
}

/** The full turn after the book closes at the end: a slow whoosh. */
export function playBookSpin(spinMs: number) {
  const a = audio();
  if (!a) return;
  const seconds = spinMs / 1000;
  burst(a, {
    at: 0,
    filter: "bandpass",
    frequency: 380,
    sweep: [
      [1300, seconds * 0.5],
      [420, seconds * 0.95],
    ],
    q: 0.9,
    peak: 0.4,
    attack: seconds * 0.5,
    decay: seconds * 0.5,
  });
}


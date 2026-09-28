/**
 * Lazy AudioContext singleton.
 *
 * Browsers require a user gesture before audio can play. Call `unlock()` from
 * a click handler to satisfy that, then synth functions can play freely.
 *
 * In SSR / Node, every accessor is a no-op (returns null) — safe to call.
 */

const isBrowser =
  (typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined') ||
  typeof (globalThis as { webkitAudioContext?: unknown }).webkitAudioContext !== 'undefined';

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let unlocked = false;

function makeCtx(): AudioContext | null {
  if (!isBrowser) return null;
  if (ctx) return ctx;
  try {
    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
    return ctx;
  } catch {
    return null;
  }
}

export function unlock(): void {
  const c = makeCtx();
  if (!c) return;
  if (c.state === 'suspended') {
    void c.resume();
  }
  unlocked = true;
}

export function isUnlocked(): boolean {
  return unlocked;
}

export function setMasterVolume(value: number): void {
  if (!masterGain || !ctx) return;
  masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, value)), ctx.currentTime);
}

export function getCtx(): AudioContext | null {
  return makeCtx();
}

export function getMasterGain(): GainNode | null {
  return masterGain ?? (makeCtx(), masterGain);
}

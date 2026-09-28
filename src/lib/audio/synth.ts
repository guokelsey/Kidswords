/**
 * Procedural sound effects via WebAudio. Zero asset weight.
 *
 * Each function builds a short audio graph on the master gain node and
 * auto-cleans up. Returns a handle with `stop()` for early cancellation;
 * null in non-browser environments so callers can ignore safely.
 */

import { getCtx, getMasterGain } from './engine';

export interface PlayHandle {
  stop(): void;
}

function noiseBuffer(durationSec: number): AudioBuffer | null {
  const ctx = getCtx();
  if (!ctx) return null;
  const len = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

/**
 * Stone throw: short white-noise burst with a quick downward bandpass sweep.
 * Sounds like a pebble tossed through air.
 */
export function throwStone(): PlayHandle | null {
  const ctx = getCtx();
  const dest = getMasterGain();
  if (!ctx || !dest) return null;

  const t = ctx.currentTime;
  const dur = 0.18;
  const buf = noiseBuffer(dur);
  if (!buf) return null;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(1400, t);
  bp.frequency.exponentialRampToValueAtTime(400, t + dur);
  bp.Q.value = 1.2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  src.connect(bp).connect(gain).connect(dest);
  src.start(t);
  src.stop(t + dur + 0.02);

  return {
    stop: () => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    }
  };
}

/**
 * Audio settings persisted to localStorage.
 * Fail-soft: any parse error returns defaults.
 */

const KEY = 'lq.audio.v1';

export interface AudioSettings {
  enabled: boolean;
  volume: number;
}

const DEFAULTS: AudioSettings = {
  enabled: true,
  volume: 0.8
};

const hasLocalStorage =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as { localStorage?: unknown }).localStorage !== 'undefined';
const ls = (globalThis as unknown as { localStorage?: Storage }).localStorage;

function read(): AudioSettings {
  if (!hasLocalStorage || !ls) return { ...DEFAULTS };
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<AudioSettings>;
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULTS.enabled,
      volume:
        typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 1
          ? parsed.volume
          : DEFAULTS.volume
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function write(s: AudioSettings): void {
  if (!hasLocalStorage || !ls) return;
  try {
    ls.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota exceeded or storage disabled — silent */
  }
}

let cache: AudioSettings | null = null;

export function getAudioSettings(): AudioSettings {
  if (!cache) cache = read();
  return cache;
}

export function setAudioEnabled(enabled: boolean): void {
  const s = getAudioSettings();
  s.enabled = enabled;
  cache = s;
  write(s);
}

export function setAudioVolume(volume: number): void {
  const s = getAudioSettings();
  s.volume = Math.max(0, Math.min(1, volume));
  cache = s;
  write(s);
}

export function resetAudioCache(): void {
  cache = null;
}

import { describe, it, expect, beforeEach } from 'vitest';
import { loadJSON, saveJSON, getVersion, checkVersion } from '../../src/lib/storage';

// Provide a minimal localStorage shim for node test env.
type Store = Record<string, string>;
const store: Store = ((globalThis as unknown as { __store: Store }).__store ??= {});

(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem(k: string) {
    return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
  },
  setItem(k: string, v: string) {
    store[k] = String(v);
  },
  removeItem(k: string) {
    delete store[k];
  },
  clear() {
    for (const k of Object.keys(store)) delete store[k];
  },
  key(i: number) {
    return Object.keys(store)[i] ?? null;
  },
  get length() {
    return Object.keys(store).length;
  }
} as Storage;

describe('storage (versioned localStorage wrapper)', () => {
  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];
  });

  it('loadJSON returns fallback when key missing', () => {
    expect(loadJSON<{ x: number }>('nope', { x: 7 })).toEqual({ x: 7 });
  });

  it('saveJSON + loadJSON roundtrips objects', () => {
    const payload = { name: 'kid', gems: 42, list: [1, 2, 3] };
    expect(saveJSON('lq.game.profile', payload)).toBe(true);
    expect(loadJSON('lq.game.profile', null)).toEqual(payload);
  });

  it('loadJSON returns fallback on corrupted JSON', () => {
    store['lq.game.broken'] = '{not valid json';
    expect(loadJSON<unknown>('lq.game.broken', { default: true })).toEqual({ default: true });
  });

  it('checkVersion sets initial version on first run', () => {
    expect(checkVersion()).toBe(true);
    expect(getVersion()).toBe(1);
  });
});

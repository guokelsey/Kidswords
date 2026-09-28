/**
 * Mulberry32 — small, fast, seedable PRNG.
 * Deterministic given the same seed. Use for reproducible question order in
 * content packs; do NOT use for anything security-sensitive.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inclusive integer in [min, max]. */
export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Pick a random element from a non-empty array. Throws on empty. */
export function pickOne<T>(rng: () => number, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pickOne: empty array');
  return items[Math.floor(rng() * items.length)];
}

/** Fisher–Yates in-place shuffle, deterministic given the rng. */
export function shuffle<T>(rng: () => number, items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

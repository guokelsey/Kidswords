import { describe, it, expect } from 'vitest';
import { throwStone } from '../../src/lib/audio/synth';

describe('throwStone', () => {
  it('returns null in a non-browser environment (no AudioContext)', () => {
    // vitest runs in node by default — no AudioContext available.
    // The function must fail-soft, never throw.
    expect(() => throwStone()).not.toThrow();
    expect(throwStone()).toBeNull();
  });

  it('is exported as a function', () => {
    expect(typeof throwStone).toBe('function');
  });
});

import { describe, it, expect } from 'vitest';
import {
  streakMultiplier,
  computeDamage,
  nextStreak,
  MAX_MULTIPLIER
} from '../../src/lib/core/damage';

describe('streakMultiplier', () => {
  it('returns 1 at streak 0', () => {
    expect(streakMultiplier(0)).toBe(1);
  });
  it('returns 1.5 at streak 1', () => {
    expect(streakMultiplier(1)).toBe(1.5);
  });
  it('caps at MAX_MULTIPLIER (5) for long streaks', () => {
    expect(streakMultiplier(20)).toBe(MAX_MULTIPLIER);
    expect(streakMultiplier(100)).toBe(5);
  });
  it('treats negative streak as 0', () => {
    expect(streakMultiplier(-5)).toBe(1);
  });
});

describe('computeDamage', () => {
  it('base 10 streak 0 = 10', () => {
    expect(computeDamage({ base: 10, streak: 0 })).toBe(10);
  });
  it('base 10 streak 2 = 20 (mult 2x)', () => {
    expect(computeDamage({ base: 10, streak: 2 })).toBe(20);
  });
  it('crit doubles', () => {
    expect(computeDamage({ base: 10, streak: 0, isCrit: true })).toBe(20);
  });
  it('caps mult + crit at sensible values', () => {
    expect(computeDamage({ base: 10, streak: 100, isCrit: true })).toBe(100);
  });
  it('zero base = zero damage', () => {
    expect(computeDamage({ base: 0, streak: 5 })).toBe(0);
  });
  it('minimum damage 1 even at negative input', () => {
    expect(computeDamage({ base: 0.5, streak: 0 })).toBe(1);
  });
});

describe('nextStreak', () => {
  it('grows on correct', () => {
    expect(nextStreak(3, true)).toBe(4);
    expect(nextStreak(0, true)).toBe(1);
  });
  it('resets to 0 on wrong', () => {
    expect(nextStreak(5, false)).toBe(0);
  });
});

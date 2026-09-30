/**
 * Pure damage calculation. No DOM, no Pixi.
 *
 * Streak multiplier is `1 + 0.5 * streak`, capped at `MAX_MULTIPLIER` to
 * prevent late-game trivialization.
 *
 * A "crit" doubles damage once per attack (used by skills in later
 * milestones). Always rounds down to keep numbers kid-friendly.
 */

export const MAX_MULTIPLIER = 5;

export function streakMultiplier(streak: number): number {
  if (streak < 0) return 1;
  return Math.min(1 + 0.5 * streak, MAX_MULTIPLIER);
}

export interface DamageOpts {
  base: number;
  streak: number;
  isCrit?: boolean;
}

export function computeDamage({ base, streak, isCrit = false }: DamageOpts): number {
  if (base <= 0) return 0;
  const raw = base * streakMultiplier(streak) * (isCrit ? 2 : 1);
  return Math.max(1, Math.round(raw));
}

/** Streak grows on correct, resets to 0 on wrong. Returns next streak. */
export function nextStreak(currentStreak: number, correct: boolean): number {
  return correct ? currentStreak + 1 : 0;
}

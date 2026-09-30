/**
 * Spelling answer comparison. Pure functions — easy to test.
 *
 * Comparison rules:
 *   - case-insensitive
 *   - trim leading/trailing whitespace
 *   - strip final sentence punctuation (., !, ?, ;, :)
 *   - collapse interior whitespace
 *
 * A word's `en` array is the list of accepted forms. First entry is the
 * canonical answer shown in the result screen.
 */

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

export function isCorrect(userInput: string, acceptedForms: readonly string[]): boolean {
  if (acceptedForms.length === 0) return false;
  const u = normalize(userInput);
  if (u === '') return false;
  for (const form of acceptedForms) {
    if (normalize(form) === u) return true;
  }
  return false;
}

/** Pick a random element using a seeded rng. Throws if array is empty. */
export function pickRandom<T>(rng: () => number, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pickRandom: empty array');
  return items[Math.floor(rng() * items.length)];
}

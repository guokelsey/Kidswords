import { describe, it, expect } from 'vitest';
import { normalize, isCorrect, pickRandom } from '../../src/lib/core/spelling';

describe('normalize', () => {
  it('lowercases', () => {
    expect(normalize('Apple')).toBe('apple');
  });
  it('trims whitespace', () => {
    expect(normalize('  apple  ')).toBe('apple');
  });
  it('strips final punctuation', () => {
    expect(normalize('apple.')).toBe('apple');
    expect(normalize('apple!')).toBe('apple');
    expect(normalize('apple?')).toBe('apple');
    expect(normalize('apple;')).toBe('apple');
    expect(normalize('apple:')).toBe('apple');
  });
  it('keeps interior punctuation', () => {
    expect(normalize("it's")).toBe("it's");
  });
  it('collapses interior whitespace', () => {
    expect(normalize('  apple   pie  ')).toBe('apple pie');
  });
});

describe('isCorrect', () => {
  const forms = ['apple', 'an apple'];

  it('matches canonical lowercase', () => {
    expect(isCorrect('apple', forms)).toBe(true);
  });
  it('matches capitalized', () => {
    expect(isCorrect('Apple', forms)).toBe(true);
  });
  it('matches second accepted form', () => {
    expect(isCorrect('an apple', forms)).toBe(true);
  });
  it('matches with final punctuation', () => {
    expect(isCorrect('apple.', forms)).toBe(true);
  });
  it('rejects wrong word', () => {
    expect(isCorrect('banana', forms)).toBe(false);
  });
  it('rejects empty input', () => {
    expect(isCorrect('', forms)).toBe(false);
    expect(isCorrect('   ', forms)).toBe(false);
  });
  it('rejects when no accepted forms', () => {
    expect(isCorrect('apple', [])).toBe(false);
  });
});

describe('pickRandom', () => {
  it('picks from given items deterministically with a stub rng', () => {
    const items = ['a', 'b', 'c'];
    const always0 = () => 0;
    expect(pickRandom(always0, items)).toBe('a');
    const almost1 = () => 0.99;
    expect(pickRandom(almost1, items)).toBe('c');
  });
  it('throws on empty', () => {
    expect(() => pickRandom(Math.random, [])).toThrow();
  });
});

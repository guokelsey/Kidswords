/**
 * Sample G1 spelling words. Curated, original — do NOT bundle PEP textbook
 * content. Users add their own list to `content/words/user.json` (gitignored).
 *
 * Full curriculum + adaptive difficulty lands in M3.
 */

export interface Word {
  id: string;
  zh: string;
  en: readonly string[];
}

export const SAMPLE_WORDS: readonly Word[] = [
  { id: 'apple', zh: '苹果', en: ['apple'] },
  { id: 'cat', zh: '猫', en: ['cat'] },
  { id: 'dog', zh: '狗', en: ['dog'] },
  { id: 'book', zh: '书', en: ['book'] },
  { id: 'sun', zh: '太阳', en: ['sun'] },
  { id: 'moon', zh: '月亮', en: ['moon'] },
  { id: 'milk', zh: '牛奶', en: ['milk'] },
  { id: 'red', zh: '红色', en: ['red'] },
  { id: 'blue', zh: '蓝色', en: ['blue'] },
  { id: 'fish', zh: '鱼', en: ['fish'] },
  { id: 'bird', zh: '鸟', en: ['bird'] },
  { id: 'hand', zh: '手', en: ['hand'] },
  { id: 'eye', zh: '眼睛', en: ['eye'] },
  { id: 'one', zh: '一', en: ['one'] },
  { id: 'two', zh: '二', en: ['two'] }
];

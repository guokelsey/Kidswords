/**
 * Minimal M1 i18n placeholder. Real implementation (svelte-i18n or custom
 * reactive store + JSON catalogues) lands in M8.
 */

export type Locale = 'zh-CN' | 'en-US';

export const SUPPORTED_LOCALES: readonly Locale[] = ['zh-CN', 'en-US'] as const;
export const DEFAULT_LOCALE: Locale = 'zh-CN';

const STRINGS: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    title: 'LearnQuest',
    subtitle: '拼单词 · 算数学 · 打怪物',
    play: '开始'
  },
  'en-US': {
    title: 'LearnQuest',
    subtitle: 'Spell · Calculate · Battle',
    play: 'Play'
  }
};

let current: Locale = DEFAULT_LOCALE;

export function getLocale(): Locale {
  return current;
}

export function setLocale(loc: Locale): void {
  if (SUPPORTED_LOCALES.includes(loc)) current = loc;
}

export function t(key: string): string {
  return STRINGS[current][key] ?? key;
}

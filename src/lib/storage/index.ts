/**
 * Versioned localStorage wrapper.
 *
 * - `checkVersion()` runs at app boot. If the stored version differs from
 *   `CURRENT_VERSION`, all `lq.game.*` keys are wiped while `lq.audio.*` and
 *   `lq.settings.*` are preserved. New version is recorded.
 * - `loadJSON` / `saveJSON` are fail-soft: any error returns the fallback and
 *   never throws to the caller.
 */

const VERSION_KEY = 'lq.version';
const CURRENT_VERSION = 1;

const hasLocalStorage =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as { localStorage?: unknown }).localStorage !== 'undefined';

export function checkVersion(): boolean {
  if (!hasLocalStorage) return true;
  try {
    const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
    const v = ls.getItem(VERSION_KEY);
    if (v === null) {
      ls.setItem(VERSION_KEY, String(CURRENT_VERSION));
      return true;
    }
    if (Number(v) !== CURRENT_VERSION) {
      const preserved: Record<string, string> = {};
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (!k) continue;
        if (k.startsWith('lq.game.')) continue; // wipe game data only
        const val = ls.getItem(k);
        if (val !== null) preserved[k] = val;
      }
      ls.clear();
      for (const [k, val] of Object.entries(preserved)) {
        ls.setItem(k, val);
      }
      ls.setItem(VERSION_KEY, String(CURRENT_VERSION));
      return false;
    }
    return true;
  } catch (err) {
    console.warn('storage: version check failed', err);
    return true;
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  if (!hasLocalStorage) return fallback;
  try {
    const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
    const raw = ls.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): boolean {
  if (!hasLocalStorage) return false;
  try {
    const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn('storage: save failed', key, err);
    return false;
  }
}

export function remove(key: string): void {
  if (!hasLocalStorage) return;
  try {
    const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
    ls.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getVersion(): number {
  if (!hasLocalStorage) return CURRENT_VERSION;
  const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
  const v = ls.getItem(VERSION_KEY);
  return v === null ? 0 : Number(v);
}

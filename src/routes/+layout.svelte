<script lang="ts">
  import { onMount } from 'svelte';
  import { checkVersion } from '$lib/storage';
  import { unlock } from '$lib/audio/engine';
  import { getAudioSettings, setAudioEnabled } from '$lib/audio/settings';
  import { t, getLocale, setLocale, type Locale } from '$lib/i18n';

  let { children } = $props();

  let audioOn = $state(true);

  onMount(() => {
    checkVersion();
    const s = getAudioSettings();
    audioOn = s.enabled;
  });

  function toggleAudio() {
    audioOn = !audioOn;
    setAudioEnabled(audioOn);
    if (audioOn) unlock();
  }

  function cycleLocale() {
    const next: Locale = getLocale() === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLocale(next);
    document.documentElement.lang = next;
    location.reload();
  }
</script>

<div class="app-shell">
  <header>
    <span class="brand">
      <span class="brand-mark">🐉</span>
      <span class="brand-text">{t('title')}</span>
    </span>
    <div class="actions">
      <button class="icon-btn" onclick={toggleAudio} aria-label="toggle audio">
        <span class="icon">{audioOn ? '🔊' : '🔇'}</span>
      </button>
      <button class="icon-btn" onclick={cycleLocale} aria-label="switch language">
        <span class="icon">{getLocale() === 'zh-CN' ? 'EN' : '中'}</span>
      </button>
    </div>
  </header>

  <main>
    {@render children()}
  </main>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family:
      'SF Pro Rounded',
      -apple-system,
      BlinkMacSystemFont,
      'PingFang SC',
      'Microsoft YaHei',
      system-ui,
      sans-serif;
    background: linear-gradient(180deg, #f5ebe0 0%, #faf6ef 35%, #ffffff 100%);
    color: #1e293b;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    letter-spacing: 0.01em;
  }
  :global(*) {
    box-sizing: border-box;
  }
  :global(h1, h2, h3) {
    font-family: 'SF Pro Rounded', system-ui, sans-serif;
    letter-spacing: -0.02em;
  }
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1.5rem;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: saturate(160%) blur(12px);
    -webkit-backdrop-filter: saturate(160%) blur(12px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.125rem;
    color: #0f766e;
  }
  .brand-mark {
    font-size: 1.4rem;
    filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.1));
  }
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  .icon-btn {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(15, 118, 110, 0.15);
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 0.95rem;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    min-height: 40px;
    min-width: 40px;
    transition: all 0.15s ease;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
  }
  .icon-btn:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(15, 118, 110, 0.3);
    transform: translateY(-1px);
  }
  .icon-btn:active {
    transform: translateY(0);
  }
  .icon {
    display: inline-block;
    line-height: 1;
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>

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
    <span class="brand">{t('title')}</span>
    <div class="actions">
      <button class="icon-btn" onclick={toggleAudio} aria-label="toggle audio">
        {audioOn ? '🔊' : '🔇'}
      </button>
      <button class="icon-btn" onclick={cycleLocale} aria-label="switch language">
        {getLocale() === 'zh-CN' ? 'EN' : '中'}
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
      system-ui,
      -apple-system,
      'PingFang SC',
      'Microsoft YaHei',
      sans-serif;
    background: linear-gradient(180deg, #e0f7ff 0%, #fafafa 60%);
    color: #1f2937;
    -webkit-tap-highlight-color: transparent;
  }
  :global(*) {
    box-sizing: border-box;
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
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .brand {
    font-weight: 700;
    font-size: 1.125rem;
    color: #064e3b;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  .icon-btn {
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 0.4rem 0.7rem;
    font-size: 0.95rem;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    min-height: 40px;
    min-width: 40px;
  }
  .icon-btn:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>

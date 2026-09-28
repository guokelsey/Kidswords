<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import PixiCanvas from '$lib/components/PixiCanvas.svelte';
  import { throwStone } from '$lib/audio/synth';
  import { unlock } from '$lib/audio/engine';
  import { t } from '$lib/i18n';

  function onPlay() {
    // First click: unlock the AudioContext (browser policy).
    unlock();
    throwStone();
  }
</script>

<div class="stage">
  <PixiCanvas background="#87ceeb" />

  <div class="overlay">
    <h1>{t('title')}</h1>
    <p class="subtitle">{t('subtitle')}</p>
    <div class="cta">
      <Button onclick={onPlay}>{t('play')}</Button>
    </div>
    <p class="hint">点击开始 · M1 scaffold</p>
  </div>
</div>

<style>
  .stage {
    position: relative;
    flex: 1;
    min-height: calc(100vh - 56px);
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 2rem;
    pointer-events: none;
  }
  .overlay > * {
    pointer-events: auto;
  }
  h1 {
    margin: 0;
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    color: #064e3b;
    text-shadow: 0 2px 0 rgba(255, 255, 255, 0.6);
  }
  .subtitle {
    margin: 0;
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: #1f2937;
  }
  .cta {
    margin-top: 0.5rem;
  }
  .hint {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: #6b7280;
  }
</style>

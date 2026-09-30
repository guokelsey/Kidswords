<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { unlock } from '$lib/audio/engine';
  import { throwStone } from '$lib/audio/synth';
  import { t } from '$lib/i18n';

  function onPlay() {
    unlock();
    throwStone();
    window.location.href = '/battle';
  }
</script>

<div class="stage">
  <div class="sky" aria-hidden="true">
    <div class="cloud cloud-a"></div>
    <div class="cloud cloud-b"></div>
    <div class="cloud cloud-c"></div>
  </div>

  <div class="ground" aria-hidden="true"></div>

  <div class="hero">
    <svg viewBox="0 0 220 200" width="260" height="240" aria-label="slime hero">
      <defs>
        <radialGradient id="heroShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="rgba(0,0,0,0.35)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="heroBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a5f3fc" />
          <stop offset="50%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0369a1" />
        </linearGradient>
        <radialGradient id="heroShine" cx="0.3" cy="0.2" r="0.4">
          <stop offset="0%" stop-color="rgba(255,255,255,0.9)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="188" rx="76" ry="9" fill="url(#heroShadow)" />
      <path
        d="M28 138 Q28 48 110 48 Q192 48 192 138 Q192 172 110 172 Q28 172 28 138 Z"
        fill="url(#heroBody)"
        stroke="#0c4a6e"
        stroke-width="2"
      />
      <ellipse cx="76" cy="78" rx="40" ry="24" fill="url(#heroShine)" />
      <ellipse cx="62" cy="94" rx="7" ry="4" fill="rgba(255,255,255,0.5)" />
      <circle cx="120" cy="150" r="5" fill="rgba(255,255,255,0.25)" />
      <circle cx="95" cy="155" r="3" fill="rgba(255,255,255,0.2)" />
      <ellipse cx="84" cy="115" rx="11" ry="13" fill="#0f172a" />
      <ellipse cx="136" cy="115" rx="11" ry="13" fill="#0f172a" />
      <circle cx="88" cy="110" r="4" fill="#fff" />
      <circle cx="140" cy="110" r="4" fill="#fff" />
      <circle cx="81" cy="119" r="2" fill="#fff" />
      <circle cx="133" cy="119" r="2" fill="#fff" />
      <circle cx="62" cy="138" r="8" fill="#fda4af" opacity="0.65" />
      <circle cx="158" cy="138" r="8" fill="#fda4af" opacity="0.65" />
      <path
        d="M92 142 Q110 156 128 142"
        fill="none"
        stroke="#0f172a"
        stroke-width="3.5"
        stroke-linecap="round"
      />
      <ellipse cx="30" cy="142" rx="9" ry="6" fill="#0284c7" />
      <ellipse cx="190" cy="142" rx="9" ry="6" fill="#0284c7" />
    </svg>
  </div>

  <div class="overlay">
    <h1>{t('title')}</h1>
    <p class="subtitle">{t('subtitle')}</p>
    <div class="cta">
      <Button onclick={onPlay}>开始游戏</Button>
    </div>
    <p class="hint">看中文 · 拼英文 · 攻击小怪物</p>
  </div>
</div>

<style>
  .stage {
    position: relative;
    flex: 1;
    min-height: calc(100vh - 56px);
    overflow: hidden;
  }
  .sky {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 40%, #fef3c7 100%);
    pointer-events: none;
  }
  .cloud {
    position: absolute;
    background: radial-gradient(ellipse, rgba(255, 255, 255, 0.95) 30%, transparent 70%);
    border-radius: 999px;
    pointer-events: none;
  }
  .cloud-a {
    width: 240px;
    height: 90px;
    top: 6%;
    left: 8%;
    animation: drift 30s linear infinite;
  }
  .cloud-b {
    width: 180px;
    height: 70px;
    top: 16%;
    right: 10%;
    animation: drift 42s linear infinite reverse;
  }
  .cloud-c {
    width: 300px;
    height: 100px;
    top: 28%;
    left: 48%;
    animation: drift 52s linear infinite;
  }
  @keyframes drift {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(50px);
    }
    100% {
      transform: translateX(0);
    }
  }
  .ground {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 26%;
    background: linear-gradient(180deg, #86efac 0%, #4ade80 60%, #16a34a 100%);
    border-top: 4px solid #15803d;
    box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.2);
  }
  .ground::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 5%;
    width: 90%;
    height: 6px;
    background: radial-gradient(ellipse, rgba(255, 255, 255, 0.5), transparent 70%);
    border-radius: 999px;
  }
  .hero {
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    animation: float 2.6s ease-in-out infinite;
  }
  @keyframes float {
    0%,
    100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(-10px);
    }
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.9rem;
    padding: 2rem;
    pointer-events: none;
    z-index: 4;
  }
  .overlay > * {
    pointer-events: auto;
  }
  h1 {
    margin: 0;
    font-size: clamp(2.5rem, 7vw, 4rem);
    color: #0f766e;
    text-shadow: 0 2px 0 rgba(255, 255, 255, 0.5);
    font-weight: 800;
  }
  .subtitle {
    margin: 0;
    font-size: clamp(1rem, 2.4vw, 1.25rem);
    color: #475569;
    font-weight: 500;
  }
  .cta {
    margin-top: 0.75rem;
  }
  .hint {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    color: #64748b;
  }
</style>

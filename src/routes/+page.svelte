<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import PixiCanvas from '$lib/components/PixiCanvas.svelte';
  import { throwStone } from '$lib/audio/synth';
  import { unlock } from '$lib/audio/engine';
  import { t } from '$lib/i18n';

  let hits = $state(0);
  let throwing = $state(false);
  let impactKey = $state(0); // bump to retrigger hit animation

  function onPlay() {
    unlock();
    throwStone();
    throwing = true;
    setTimeout(() => {
      throwing = false;
      hits += 1;
      impactKey += 1;
    }, 420);
  }
</script>

<div class="stage">
  <PixiCanvas background="transparent" />

  <div class="sky" aria-hidden="true">
    <div class="cloud cloud-a"></div>
    <div class="cloud cloud-b"></div>
    <div class="cloud cloud-c"></div>
  </div>

  <div class="ground" aria-hidden="true"></div>

  <div class="monster-wrap">
    {#key impactKey}
      <div class="monster" class:hit={impactKey > 0}>
        <svg viewBox="0 0 200 180" width="200" height="180" aria-label="slime monster">
          <ellipse cx="100" cy="168" rx="62" ry="8" fill="rgba(0,0,0,0.15)" />
          <defs>
            <linearGradient id="slimeBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7dd3fc" />
              <stop offset="60%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0284c7" />
            </linearGradient>
            <radialGradient id="slimeShine" cx="0.35" cy="0.25" r="0.5">
              <stop offset="0%" stop-color="rgba(255,255,255,0.85)" />
              <stop offset="100%" stop-color="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <path
            d="M30 130 Q30 50 100 50 Q170 50 170 130 Q170 158 100 158 Q30 158 30 130 Z"
            fill="url(#slimeBody)"
          />
          <ellipse cx="70" cy="78" rx="36" ry="22" fill="url(#slimeShine)" />
          <ellipse cx="78" cy="105" rx="9" ry="11" fill="#0f172a" />
          <ellipse cx="122" cy="105" rx="9" ry="11" fill="#0f172a" />
          <circle cx="81" cy="101" r="3" fill="#fff" />
          <circle cx="125" cy="101" r="3" fill="#fff" />
          <path
            d="M82 130 Q100 142 118 130"
            fill="none"
            stroke="#0f172a"
            stroke-width="3"
            stroke-linecap="round"
          />
          <circle cx="65" cy="125" r="6" fill="#fda4af" opacity="0.7" />
          <circle cx="135" cy="125" r="6" fill="#fda4af" opacity="0.7" />
        </svg>
        <div class="hp-bar" aria-hidden="true">
          <div class="hp-fill" style="width: {Math.max(0, 100 - hits * 8)}%"></div>
        </div>
      </div>
    {/key}
  </div>

  {#if throwing}
    <div class="projectile" aria-hidden="true">
      <svg viewBox="0 0 40 40" width="40" height="40">
        <defs>
          <radialGradient id="stoneGrad" cx="0.4" cy="0.4">
            <stop offset="0%" stop-color="#d6d3d1" />
            <stop offset="80%" stop-color="#78716c" />
            <stop offset="100%" stop-color="#44403c" />
          </radialGradient>
        </defs>
        <ellipse cx="20" cy="20" rx="15" ry="13" fill="url(#stoneGrad)" />
        <ellipse cx="14" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  {/if}

  <div class="overlay">
    <h1>{t('title')}</h1>
    <p class="subtitle">{t('subtitle')}</p>
    <div class="cta">
      <Button onclick={onPlay}>{t('play')}</Button>
    </div>
    <p class="hits">击中 {hits} 次</p>
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
    width: 220px;
    height: 80px;
    top: 8%;
    left: 10%;
    animation: drift 28s linear infinite;
  }
  .cloud-b {
    width: 160px;
    height: 60px;
    top: 18%;
    right: 12%;
    animation: drift 38s linear infinite reverse;
  }
  .cloud-c {
    width: 280px;
    height: 90px;
    top: 30%;
    left: 50%;
    animation: drift 48s linear infinite;
  }
  @keyframes drift {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(40px);
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
    height: 28%;
    background: linear-gradient(180deg, #86efac 0%, #4ade80 60%, #16a34a 100%);
    border-top: 4px solid #15803d;
    box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.2);
  }
  .monster-wrap {
    position: absolute;
    bottom: 22%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  .monster {
    transition: transform 0.12s ease;
  }
  .monster.hit {
    animation: shake 0.32s ease;
  }
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-8px) rotate(-2deg);
    }
    40% {
      transform: translateX(7px) rotate(2deg);
    }
    60% {
      transform: translateX(-5px) rotate(-1deg);
    }
    80% {
      transform: translateX(4px) rotate(1deg);
    }
  }
  .hp-bar {
    width: 140px;
    height: 10px;
    margin: 0.5rem auto 0;
    background: rgba(15, 23, 42, 0.15);
    border-radius: 999px;
    overflow: hidden;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .hp-fill {
    height: 100%;
    background: linear-gradient(90deg, #f43f5e, #fb7185);
    transition: width 0.3s ease;
    border-radius: 999px;
  }
  .projectile {
    position: absolute;
    bottom: 28%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    animation: fly 0.42s cubic-bezier(0.5, 0.05, 0.8, 0.4) forwards;
  }
  @keyframes fly {
    0% {
      left: 50%;
      bottom: 24%;
      transform: translateX(-50%) rotate(0deg) scale(1);
      opacity: 1;
    }
    60% {
      left: 50%;
      bottom: 38%;
      opacity: 1;
    }
    100% {
      left: 50%;
      bottom: 45%;
      transform: translateX(-50%) rotate(540deg) scale(0.4);
      opacity: 0;
    }
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
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
  .hits {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    color: #64748b;
    font-variant-numeric: tabular-nums;
  }
</style>

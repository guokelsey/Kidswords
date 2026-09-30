<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import { throwStone } from '$lib/audio/synth';
  import { unlock } from '$lib/audio/engine';
  import { SAMPLE_WORDS, type Word } from '$lib/content/words';
  import { isCorrect, pickRandom } from '$lib/core/spelling';
  import { computeDamage, nextStreak } from '$lib/core/damage';
  import { mulberry32 } from '$lib/rng';

  let monster = $state({
    id: 'slime',
    hp: 50,
    maxHp: 50,
    art: 'slime'
  });
  let currentWord: Word | null = $state(null);
  let userInput = $state('');
  let streak = $state(0);
  let correctCount = $state(0);
  let wrongCount = $state(0);
  let feedback = $state<'idle' | 'correct' | 'wrong'>('idle');
  let shaking = $state(false);
  let inputRef: HTMLInputElement;
  let rng = mulberry32(Date.now() & 0xffffffff);

  const BASE_DAMAGE = 10;

  function nextQuestion() {
    let next = pickRandom(rng, SAMPLE_WORDS);
    if (SAMPLE_WORDS.length > 1) {
      while (next.id === currentWord?.id) {
        next = pickRandom(rng, SAMPLE_WORDS);
      }
    }
    currentWord = next;
    userInput = '';
    feedback = 'idle';
    setTimeout(() => inputRef?.focus(), 30);
  }

  function submit() {
    if (!currentWord) return;
    const correct = isCorrect(userInput, currentWord.en);
    if (correct) {
      const dmg = computeDamage({ base: BASE_DAMAGE, streak });
      monster = { ...monster, hp: Math.max(0, monster.hp - dmg) };
      streak = nextStreak(streak, true);
      correctCount += 1;
      feedback = 'correct';
      shaking = true;
      throwStone();
      setTimeout(() => {
        shaking = false;
        if (monster.hp <= 0) {
          monster = { ...monster, hp: monster.maxHp };
          nextQuestion();
        } else {
          nextQuestion();
        }
      }, 700);
    } else {
      streak = nextStreak(streak, false);
      wrongCount += 1;
      feedback = 'wrong';
      setTimeout(() => (feedback = 'idle'), 600);
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  onMount(() => {
    unlock();
    nextQuestion();
    inputRef?.focus();
  });

  const hpPct = $derived(monster.hp / monster.maxHp);
  const streakBadge = $derived(streak > 0 ? `连击 ×${streak}` : '');
</script>

<div class="battle">
  <header class="bar-top">
    <button class="back" onclick={() => (window.location.href = '/')} aria-label="back to home"
      >‹ 返回</button
    >
    <div class="stats">
      <span class="stat">✔ {correctCount}</span>
      <span class="stat">✘ {wrongCount}</span>
      {#if streak > 0}<span class="streak">{streakBadge}</span>{/if}
    </div>
  </header>

  <div class="scene">
    <div class="ground" aria-hidden="true"></div>

    <div class="monster-wrap">
      <div class="monster-inner" class:shaking>
        <svg viewBox="0 0 220 200" width="240" height="220" aria-label="slime monster">
          <defs>
            <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stop-color="rgba(0,0,0,0.4)" />
              <stop offset="100%" stop-color="rgba(0,0,0,0)" />
            </radialGradient>
            <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a5f3fc" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0369a1" />
            </linearGradient>
            <radialGradient id="shine" cx="0.3" cy="0.2" r="0.4">
              <stop offset="0%" stop-color="rgba(255,255,255,0.9)" />
              <stop offset="100%" stop-color="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          <ellipse cx="110" cy="188" rx="72" ry="9" fill="url(#shadow)" />

          <path
            d="M30 138 Q30 50 110 50 Q190 50 190 138 Q190 170 110 170 Q30 170 30 138 Z"
            fill="url(#body)"
            stroke="#0c4a6e"
            stroke-width="2"
          />

          <ellipse cx="78" cy="80" rx="38" ry="22" fill="url(#shine)" />
          <ellipse cx="65" cy="95" rx="6" ry="4" fill="rgba(255,255,255,0.5)" />

          <circle cx="120" cy="150" r="5" fill="rgba(255,255,255,0.25)" />
          <circle cx="95" cy="155" r="3" fill="rgba(255,255,255,0.2)" />

          <ellipse cx="85" cy="115" rx="11" ry="13" fill="#0f172a" />
          <ellipse cx="135" cy="115" rx="11" ry="13" fill="#0f172a" />
          <circle cx="89" cy="110" r="4" fill="#fff" />
          <circle cx="139" cy="110" r="4" fill="#fff" />
          <circle cx="82" cy="119" r="2" fill="#fff" />
          <circle cx="132" cy="119" r="2" fill="#fff" />

          <circle cx="62" cy="138" r="8" fill="#fda4af" opacity="0.65" />
          <circle cx="158" cy="138" r="8" fill="#fda4af" opacity="0.65" />

          {#if monster.hp > monster.maxHp / 2}
            <path
              d="M92 142 Q110 156 128 142"
              fill="none"
              stroke="#0f172a"
              stroke-width="3.5"
              stroke-linecap="round"
            />
          {:else}
            <path
              d="M92 148 Q110 138 128 148"
              fill="none"
              stroke="#0f172a"
              stroke-width="3.5"
              stroke-linecap="round"
            />
          {/if}

          <ellipse cx="32" cy="142" rx="9" ry="6" fill="#0284c7" />
          <ellipse cx="188" cy="142" rx="9" ry="6" fill="#0284c7" />
        </svg>
      </div>
      <div class="hp-bar" aria-label="monster HP">
        <div class="hp-fill" style="width: {hpPct * 100}%"></div>
        <span class="hp-text">{monster.hp} / {monster.maxHp}</span>
      </div>
    </div>
  </div>

  <div class="qbox" class:correct={feedback === 'correct'} class:wrong={feedback === 'wrong'}>
    {#if currentWord}
      <div class="prompt">{currentWord.zh}</div>
      <div class="hint">拼写英文</div>
    {/if}
  </div>

  <form
    class="answer"
    onsubmit={(e) => {
      e.preventDefault();
      submit();
    }}
  >
    <input
      bind:this={inputRef}
      bind:value={userInput}
      onkeydown={onKey}
      type="text"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      placeholder="输入英文..."
      aria-label="English answer"
      class:correct={feedback === 'correct'}
      class:wrong={feedback === 'wrong'}
    />
    <Button onclick={submit} disabled={!currentWord || userInput.trim() === ''}>攻击</Button>
  </form>
</div>

<style>
  .battle {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 56px);
    background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 40%, #fef3c7 100%);
  }
  .bar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1.25rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
  }
  .back {
    background: transparent;
    border: 1px solid rgba(15, 23, 42, 0.15);
    border-radius: 999px;
    padding: 0.45rem 1rem;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.95rem;
    color: inherit;
  }
  .back:hover {
    background: rgba(255, 255, 255, 0.7);
  }
  .stats {
    display: flex;
    gap: 0.75rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .stat {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
    font-size: 0.95rem;
  }
  .streak {
    background: linear-gradient(135deg, #fb923c, #f43f5e);
    color: #fff;
    border-radius: 999px;
    padding: 0.35rem 0.95rem;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px rgba(244, 63, 94, 0.4);
    animation: pulse 0.6s ease infinite alternate;
  }
  @keyframes pulse {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.06);
    }
  }

  .scene {
    position: relative;
    flex: 1;
    min-height: 320px;
    overflow: hidden;
  }
  .ground {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(180deg, #86efac 0%, #22c55e 70%, #15803d 100%);
    border-top: 4px solid #166534;
    box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.18);
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
  .monster-wrap {
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
  }
  .monster-inner {
    transition: transform 0.12s ease;
    animation: float 2.4s ease-in-out infinite;
  }
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  .monster-inner.shaking {
    animation: shake 0.4s ease;
  }
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0) translateY(0);
    }
    20% {
      transform: translateX(-10px) translateY(2px) rotate(-3deg);
    }
    40% {
      transform: translateX(9px) translateY(-2px) rotate(3deg);
    }
    60% {
      transform: translateX(-7px) translateY(2px) rotate(-2deg);
    }
    80% {
      transform: translateX(5px) translateY(-2px) rotate(2deg);
    }
  }
  .hp-bar {
    position: relative;
    width: 180px;
    height: 18px;
    margin-top: 0.4rem;
    background: rgba(15, 23, 42, 0.18);
    border: 2px solid rgba(15, 23, 42, 0.3);
    border-radius: 999px;
    overflow: hidden;
  }
  .hp-fill {
    height: 100%;
    background: linear-gradient(90deg, #f43f5e, #fb923c, #fbbf24);
    transition: width 0.4s ease;
    border-radius: 999px;
  }
  .hp-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .qbox {
    margin: 0 auto;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 18px;
    text-align: center;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    max-width: 90%;
    transition:
      transform 0.15s ease,
      background 0.2s ease;
  }
  .qbox.correct {
    background: #d1fae5;
    transform: scale(1.04);
  }
  .qbox.wrong {
    background: #fee2e2;
    transform: translateX(-4px);
  }
  .prompt {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 800;
    color: #0f766e;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .hint {
    margin-top: 0.35rem;
    font-size: 0.85rem;
    color: #64748b;
  }

  .answer {
    display: flex;
    gap: 0.6rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  .answer input {
    flex: 1;
    min-height: 60px;
    padding: 0 1.1rem;
    font-size: 1.5rem;
    font-family: inherit;
    font-weight: 600;
    border: 2px solid rgba(15, 118, 110, 0.25);
    border-radius: 14px;
    background: #fff;
    outline: none;
    color: inherit;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }
  .answer input:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.18);
  }
  .answer input.correct {
    border-color: #10b981;
    background: #ecfdf5;
  }
  .answer input.wrong {
    border-color: #ef4444;
    background: #fef2f2;
    animation: inputShake 0.4s ease;
  }
  @keyframes inputShake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-6px);
    }
    75% {
      transform: translateX(6px);
    }
  }
</style>

<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    ariaLabel?: string;
    type?: 'button' | 'submit';
  }

  let {
    onclick,
    children,
    variant = 'primary',
    disabled = false,
    ariaLabel,
    type = 'button'
  }: Props = $props();
</script>

<button {type} class="btn {variant}" {onclick} {disabled} aria-label={ariaLabel}>
  {@render children()}
</button>

<style>
  .btn {
    min-height: 60px;
    min-width: 160px;
    padding: 0.95rem 2.5rem;
    font-size: 1.35rem;
    font-weight: 700;
    border: none;
    border-radius: 18px;
    cursor: pointer;
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease;
    font-family: inherit;
    user-select: none;
    -webkit-user-select: none;
    letter-spacing: 0.02em;
  }
  .btn:active:not(:disabled) {
    transform: translateY(3px);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn:focus-visible {
    outline: 3px solid #fbbf24;
    outline-offset: 3px;
  }
  .primary {
    background: linear-gradient(180deg, #5eead4 0%, #14b8a6 100%);
    color: #042f2e;
    box-shadow:
      0 6px 0 #0f766e,
      0 10px 20px -8px rgba(20, 184, 166, 0.5);
  }
  .primary:hover:not(:disabled) {
    box-shadow:
      0 3px 0 #0f766e,
      0 6px 14px -6px rgba(20, 184, 166, 0.6);
    transform: translateY(3px);
  }
  .primary:active:not(:disabled) {
    box-shadow:
      0 0 0 #0f766e,
      0 2px 6px -2px rgba(20, 184, 166, 0.5);
  }
  .secondary {
    background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
    color: #1e293b;
    box-shadow:
      0 6px 0 #cbd5e1,
      0 10px 20px -8px rgba(15, 23, 42, 0.15);
  }
  .secondary:hover:not(:disabled) {
    box-shadow:
      0 3px 0 #cbd5e1,
      0 6px 14px -6px rgba(15, 23, 42, 0.2);
    transform: translateY(3px);
  }
  .secondary:active:not(:disabled) {
    box-shadow:
      0 0 0 #cbd5e1,
      0 2px 6px -2px rgba(15, 23, 42, 0.15);
  }
</style>

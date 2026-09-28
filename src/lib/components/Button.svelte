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
    min-height: 56px;
    min-width: 120px;
    padding: 0.75rem 2rem;
    font-size: 1.25rem;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition:
      transform 0.08s ease,
      box-shadow 0.08s ease;
    font-family: inherit;
    user-select: none;
    -webkit-user-select: none;
  }
  .btn:active:not(:disabled) {
    transform: translateY(2px);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn:focus-visible {
    outline: 3px solid #fbbf24;
    outline-offset: 2px;
  }
  .primary {
    background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
    color: #052e16;
    box-shadow: 0 4px 0 #15803d;
  }
  .primary:hover:not(:disabled) {
    box-shadow: 0 2px 0 #15803d;
  }
  .secondary {
    background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
    color: #1f2937;
    box-shadow: 0 4px 0 #9ca3af;
  }
  .secondary:hover:not(:disabled) {
    box-shadow: 0 2px 0 #9ca3af;
  }
</style>

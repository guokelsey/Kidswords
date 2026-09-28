<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { mountPixi, type PixiMount } from '$lib/pixi';

  interface Props {
    background?: string;
  }
  let { background = '#87ceeb' }: Props = $props();

  let container: HTMLDivElement;
  let mount: PixiMount | null = $state(null);

  onMount(async () => {
    mount = await mountPixi(container, { background });
  });

  onDestroy(() => {
    mount?.destroy();
    mount = null;
  });
</script>

<div bind:this={container} class="pixi-host" style:background></div>

<style>
  .pixi-host {
    width: 100%;
    height: 100%;
    min-height: 200px;
    overflow: hidden;
    border-radius: 12px;
  }
</style>

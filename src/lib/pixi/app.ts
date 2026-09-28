/**
 * Lazy PixiJS mount. Dynamic import keeps pixi.js (~150 KB gz) out of the
 * initial bundle — only loads when the game screen actually mounts.
 */

const isBrowser = typeof window !== 'undefined';

export interface PixiMount {
  destroy(): void;
  app: import('pixi.js').Application;
}

export async function mountPixi(
  container: HTMLElement,
  opts: { background?: string } = {}
): Promise<PixiMount | null> {
  if (!isBrowser) return null;
  const PIXI = await import('pixi.js');
  const app = new PIXI.Application();
  await app.init({
    background: opts.background ?? '#87ceeb',
    resizeTo: container,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2)
  });
  container.appendChild(app.canvas);
  return {
    app,
    destroy: () => {
      try {
        app.destroy(true, { children: true, texture: true });
      } catch {
        /* ignore */
      }
    }
  };
}

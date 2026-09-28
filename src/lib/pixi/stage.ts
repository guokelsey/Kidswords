/**
 * Stage constants. Real stage setup (world, monsters, projectiles) lands in M2.
 */

export const STAGE = {
  width: 800,
  height: 600,
  /** Y baseline where monsters stand. */
  groundY: 480
} as const;

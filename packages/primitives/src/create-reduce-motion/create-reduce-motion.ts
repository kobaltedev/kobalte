import { createMediaQuery } from "@solid-primitives/media";

/**
 * Detects if user prefers to reduce motion.
 */
export function createReducedMotion(fallbackState?: boolean, watchChange?: boolean) {
  return createMediaQuery("(prefers-reduced-motion: reduce)", fallbackState, watchChange);
}

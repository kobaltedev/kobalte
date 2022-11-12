import { createMediaQuery } from "@kobalte/utils";

/**
 * Detects if user prefers to reduce motion.
 */
export function createReducedMotion(fallbackState?: boolean, watchChange?: boolean) {
  return createMediaQuery("(prefers-reduced-motion: reduce)", fallbackState, watchChange);
}

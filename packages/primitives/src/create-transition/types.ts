/*!
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/transitions.ts
 */

import { JSX } from "solid-js";

export interface TransitionStyles {
  /** Styles for mounted state. */
  in: JSX.CSSProperties;

  /** Styles for unmounted state. */
  out: JSX.CSSProperties;

  /** Styles for both mounted and unmounted states. */
  common?: JSX.CSSProperties;
}

export type TransitionName =
  | "fade"
  | "skew-up"
  | "skew-down"
  | "rotate-right"
  | "rotate-left"
  | "slide-down"
  | "slide-up"
  | "slide-right"
  | "slide-left"
  | "scale-y"
  | "scale-x"
  | "scale"
  | "pop"
  | "pop-top-left"
  | "pop-top-right"
  | "pop-bottom-left"
  | "pop-bottom-right";

export type HopeTransition = TransitionName | TransitionStyles;

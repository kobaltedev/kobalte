/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 *
 * Portions of this file are based on code from sonner.
 * MIT Licensed, Copyright (c) 2023 Emil Kowalski.
 *
 * Credits to the sonner team:
 * https://github.com/emilkowalski/sonner/blob/0d027fd3a41013fada9d8a3ef807bcc87053bde8/src/index.tsx
 */

import { JSX } from "solid-js";

export type ToastSwipeDirection = "up" | "down" | "left" | "right";

export interface ToastState {
  /** The unique id of the toast. */
  id: number;

  /** Whether the toast should be immediately deleted. */
  delete?: boolean;
}

export interface ToastConfig extends ToastState {
  /** Whether the toast should be marked for dismiss. */
  dismiss?: boolean;

  /** The component to be rendered as a toast. */
  render?: (state: ToastState) => JSX.Element;
}

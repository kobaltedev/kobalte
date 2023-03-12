/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 *
 */

import { JSX } from "solid-js";

export type ToastSwipeDirection = "up" | "down" | "left" | "right";

export interface Toast {
  /** The unique id of the toast. */
  id: number;

  /** The component to be rendered as a toast. */
  render: (id: number) => JSX.Element;

  /** Whether the toast should be marked for dismiss. */
  dismiss: boolean;
}

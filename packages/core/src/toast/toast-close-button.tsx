/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 */

import { OverrideComponentProps } from "@kobalte/utils";

import * as Button from "../button";

export interface ToastCloseButtonOptions extends Button.ButtonRootOptions {}

export type ToastCloseButtonProps = OverrideComponentProps<"button", ToastCloseButtonOptions>;

export function ToastCloseButton(props: ToastCloseButtonProps) {
  return <Button.Root {...props} />;
}

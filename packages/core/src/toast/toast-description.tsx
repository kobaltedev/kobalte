/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 */

import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

export interface ToastDescriptionOptions extends AsChildProp {}

export type ToastDescriptionProps = OverrideComponentProps<"div", ToastDescriptionOptions>;

export function ToastDescription(props: ToastDescriptionProps) {
  return <Polymorphic fallback="div" {...props} />;
}

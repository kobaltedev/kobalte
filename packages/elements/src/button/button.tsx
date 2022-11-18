/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-aria/button/src/useButton.ts
 *
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit/src/button/button.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  CREATE_PRESS_PROP_NAMES,
  createPress,
  CreatePressProps,
  createTagName,
} from "../primitives";
import { isButton } from "./is-button";

export interface ButtonProps extends CreatePressProps {
  /** Whether the button is disabled. */
  disabled?: boolean;
}

/**
 * Button enables users to trigger an action or event, such as submitting a form,
 * opening a dialog, canceling an action, or performing a delete operation.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const Button = createPolymorphicComponent<"button", ButtonProps>(props => {
  let ref: HTMLButtonElement | undefined;

  props = mergeDefaultProps(
    {
      as: "button",
      type: "button",
    },
    props
  );

  const [local, createPressProps, others] = splitProps(
    props,
    ["as", "ref", "type", "disabled"],
    CREATE_PRESS_PROP_NAMES
  );

  const { isPressed, pressHandlers } = createPress<HTMLButtonElement>(createPressProps);

  const tagName = createTagName(
    () => ref,
    () => local.as || "button"
  );

  const isNativeButton = createMemo(() => {
    const elementTagName = tagName();

    if (elementTagName == null) {
      return false;
    }

    return isButton({ tagName: elementTagName, type: local.type });
  });

  const isLink = createMemo(() => {
    return tagName() === "a" && (props as any).href != null;
  });

  const isInput = createMemo(() => {
    return tagName() === "input";
  });

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      type={isNativeButton() || isInput() ? local.type : undefined}
      role={!isNativeButton() && !isLink() ? "button" : undefined}
      tabIndex={!isNativeButton() && !isLink() && !local.disabled ? 0 : undefined}
      disabled={isNativeButton() || isInput() ? local.disabled : undefined}
      aria-disabled={!isNativeButton() && !isInput() && local.disabled ? true : undefined}
      data-pressed={isPressed() ? "" : undefined}
      data-disabled={local.disabled ? "" : undefined}
      {...pressHandlers}
      {...others}
    />
  );
});

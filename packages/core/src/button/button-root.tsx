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

import { createTagName } from "../primitives";
import { isButton } from "./is-button";

export interface ButtonRootOptions {
  /** Whether the button is disabled. */
  isDisabled?: boolean;
}

/**
 * Button enables users to trigger an action or event, such as submitting a form,
 * opening a dialog, canceling an action, or performing a delete operation.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const ButtonRoot = createPolymorphicComponent<"button", ButtonRootOptions>(props => {
  let ref: HTMLButtonElement | undefined;

  props = mergeDefaultProps(
    {
      as: "button",
      type: "button",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "type", "isDisabled"]);

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

  const isNativeInput = createMemo(() => {
    return tagName() === "input";
  });

  const isNativeLink = createMemo(() => {
    return tagName() === "a" && (others as any).href != null;
  });

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      type={isNativeButton() || isNativeInput() ? local.type : undefined}
      role={!isNativeButton() && !isNativeLink() ? "button" : undefined}
      tabIndex={!isNativeButton() && !isNativeLink() && !local.isDisabled ? 0 : undefined}
      disabled={isNativeButton() || isNativeInput() ? local.isDisabled : undefined}
      aria-disabled={!isNativeButton() && !isNativeInput() && local.isDisabled ? true : undefined}
      data-disabled={local.isDisabled ? "" : undefined}
      {...others}
    />
  );
});

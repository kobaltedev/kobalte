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

import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createTagName } from "../primitives";
import { isButton } from "./is-button";

export interface ButtonRootOptions extends AsChildProp {
  /** Whether the button is disabled. */
  disabled?: boolean;
}

export interface ButtonRootProps extends OverrideComponentProps<"button", ButtonRootOptions> {}

/**
 * Button enables users to trigger an action or event, such as submitting a form,
 * opening a dialog, canceling an action, or performing a delete operation.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export function ButtonRoot(props: ButtonRootProps) {
  let ref: HTMLButtonElement | undefined;

  props = mergeDefaultProps({ type: "button" }, props);

  const [local, others] = splitProps(props, ["ref", "type", "disabled"]);

  const tagName = createTagName(
    () => ref,
    () => "button"
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
    return tagName() === "a" && ref?.getAttribute("href") != null;
  });

  return (
    <Polymorphic
      as="button"
      ref={mergeRefs(el => (ref = el), local.ref)}
      type={isNativeButton() || isNativeInput() ? local.type : undefined}
      role={!isNativeButton() && !isNativeLink() ? "button" : undefined}
      tabIndex={!isNativeButton() && !isNativeLink() && !local.disabled ? 0 : undefined}
      disabled={isNativeButton() || isNativeInput() ? local.disabled : undefined}
      aria-disabled={!isNativeButton() && !isNativeInput() && local.disabled ? true : undefined}
      data-disabled={local.disabled ? "" : undefined}
      {...others}
    />
  );
}

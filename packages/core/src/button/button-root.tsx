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

import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";

import { Pressable, PressableOptions } from "../pressable";
import {
  createFocusRing,
  createHover,
  createTagName,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  HOVER_HANDLERS_PROP_NAMES,
} from "../primitives";
import { isButton } from "./is-button";

export interface ButtonRootOptions extends PressableOptions {}

/**
 * Button enables users to trigger an action or event, such as submitting a form,
 * opening a dialog, canceling an action, or performing a delete operation.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const ButtonRoot = /*#__PURE__*/ createPolymorphicComponent<"button", ButtonRootOptions>(
  props => {
    let ref: HTMLButtonElement | undefined;

    props = mergeDefaultProps(
      {
        as: "button",
        type: "button",
      },
      props
    );

    const [local, others] = splitProps(props, [
      "ref",
      ...HOVER_HANDLERS_PROP_NAMES,
      ...FOCUS_RING_HANDLERS_PROP_NAMES,
    ]);

    const { isHovered, hoverHandlers } = createHover({
      isDisabled: () => others.isDisabled,
    });

    const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

    const tagName = createTagName(
      () => ref,
      () => others.as || "button"
    );

    const isNativeButton = createMemo(() => {
      const elementTagName = tagName();

      if (elementTagName == null) {
        return false;
      }

      return isButton({ tagName: elementTagName, type: others.type });
    });

    const isLink = createMemo(() => {
      return tagName() === "a" && (others as any).href != null;
    });

    return (
      <Pressable
        ref={mergeRefs(el => (ref = el), local.ref)}
        role={!isNativeButton() && !isLink() ? "button" : undefined}
        tabIndex={!isNativeButton() && !isLink() && !others.isDisabled ? 0 : undefined}
        data-hover={isHovered() ? "" : undefined}
        data-focus={isFocused() ? "" : undefined}
        data-focus-visible={isFocusVisible() ? "" : undefined}
        onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
        onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
        onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
        onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
        {...others}
      />
    );
  }
);

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
  callHandler,
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  CREATE_PRESS_PROP_NAMES,
  createFocusRing,
  createHover,
  createPress,
  CreatePressProps,
  createTagName,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  HOVER_HANDLERS_PROP_NAMES,
  PRESS_HANDLERS_PROP_NAMES,
} from "../primitives";
import { isButton } from "./is-button";

export interface ButtonRootOptions extends CreatePressProps {
  /** Whether the button is disabled. */
  isDisabled?: boolean;
}

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

    const [local, createPressProps, others] = splitProps(
      props,
      [
        "as",
        "ref",
        "type",
        "isDisabled",
        ...PRESS_HANDLERS_PROP_NAMES,
        ...HOVER_HANDLERS_PROP_NAMES,
        ...FOCUS_RING_HANDLERS_PROP_NAMES,
      ],
      CREATE_PRESS_PROP_NAMES
    );

    const { isPressed, pressHandlers } = createPress<HTMLButtonElement>(createPressProps);

    const { isHovered, hoverHandlers } = createHover({
      isDisabled: () => local.isDisabled,
    });

    const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

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
      return tagName() === "a" && (others as any).href != null;
    });

    const isInput = createMemo(() => {
      return tagName() === "input";
    });

    const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
      if (local.onClick) {
        callHandler(e, local.onClick);
        console.warn(
          "[kobalte]: use `onPress` instead of `onClick` for handling click interactions"
        );
      }
    };

    return (
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        type={isNativeButton() || isInput() ? local.type : undefined}
        role={!isNativeButton() && !isLink() ? "button" : undefined}
        tabIndex={!isNativeButton() && !isLink() && !local.isDisabled ? 0 : undefined}
        disabled={isNativeButton() || isInput() ? local.isDisabled : undefined}
        aria-disabled={!isNativeButton() && !isInput() && local.isDisabled ? true : undefined}
        data-disabled={local.isDisabled ? "" : undefined}
        data-hover={isHovered() ? "" : undefined}
        data-focus={isFocused() ? "" : undefined}
        data-focus-visible={isFocusVisible() ? "" : undefined}
        data-active={isPressed() ? "" : undefined}
        onKeyDown={composeEventHandlers([local.onKeyDown, pressHandlers.onKeyDown])}
        onKeyUp={composeEventHandlers([local.onKeyUp, pressHandlers.onKeyUp])}
        onClick={composeEventHandlers([onClick, pressHandlers.onClick])}
        onPointerDown={composeEventHandlers([local.onPointerDown, pressHandlers.onPointerDown])}
        onPointerUp={composeEventHandlers([local.onPointerUp, pressHandlers.onPointerUp])}
        onMouseDown={composeEventHandlers([local.onMouseDown, pressHandlers.onMouseDown])}
        onDragStart={composeEventHandlers([local.onDragStart, pressHandlers.onDragStart])}
        onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
        onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
        onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
        onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
        {...others}
      />
    );
  }
);

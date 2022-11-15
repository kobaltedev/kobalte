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
  chainHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPress, CreatePressProps, createTagName } from "../primitives";
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
    [
      "as",
      "ref",
      "type",
      "disabled",
      "onKeyDown",
      "onKeyUp",
      "onClick",
      "onPointerDown",
      "onPointerUp",
      "onMouseDown",
      "onDragStart",
    ],
    [
      "onPressStart",
      "onPressEnd",
      "onPressUp",
      "onPressChange",
      "onPress",
      //"pressed",
      "disabled",
      "preventFocusOnPress",
      "cancelOnPointerExit",
      "allowTextSelectionOnPress",
    ]
  );

  const { pressed, pressHandlers } = createPress<HTMLButtonElement>(createPressProps);

  const tagName = createTagName(
    () => ref,
    () => local.as ?? "button"
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

  const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = e => {
    chainHandlers(e, [local.onKeyDown, pressHandlers.onKeyDown]);
  };

  const onKeyUp: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = e => {
    chainHandlers(e, [local.onKeyUp, pressHandlers.onKeyUp]);
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    if (local.onClick) {
      console.warn("[kobalte]: onClick is deprecated, please use onPress");
    }

    chainHandlers(e, [local.onClick, pressHandlers.onClick]);
  };

  const onPointerDown: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    chainHandlers(e, [local.onPointerDown, pressHandlers.onPointerDown]);
  };

  const onPointerUp: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    chainHandlers(e, [local.onPointerUp, pressHandlers.onPointerUp]);
  };

  const onMouseDown: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    chainHandlers(e, [local.onMouseDown, pressHandlers.onMouseDown]);
  };

  const onDragStart: JSX.EventHandlerUnion<HTMLButtonElement, DragEvent> = e => {
    chainHandlers(e, [local.onDragStart, pressHandlers.onDragStart]);
  };

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      type={isNativeButton() || isInput() ? local.type : undefined}
      role={!isNativeButton() && !isLink() ? "button" : undefined}
      tabIndex={!isNativeButton() && !isLink() && !local.disabled ? 0 : undefined}
      disabled={isNativeButton() || isInput() ? local.disabled : undefined}
      aria-disabled={!isNativeButton() && !isInput() && local.disabled ? true : undefined}
      data-pressed={pressed() ? "" : undefined}
      data-disabled={local.disabled ? "" : undefined}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      {...others}
    />
  );
});

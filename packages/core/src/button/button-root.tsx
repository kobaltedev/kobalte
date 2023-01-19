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

const ButtonRootSymbol = Symbol("$$ButtonRoot");

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

  // Mark the handlers below as coming from a `ButtonRoot` component and prevent them from executing their
  // default behavior when a component that use `ButtonRoot` under the hood
  // is passed to the `as` prop of another component that use `ButtonRoot` under the hood.
  // This is necessary to prevent `createPress` logic being executed twice.
  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    if (local.onKeyDown) {
      callHandler(e, local.onKeyDown);

      // @ts-ignore
      if (local.onKeyDown[ButtonRootSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onKeyDown);
  };

  // @ts-ignore
  onKeyDown[ButtonRootSymbol] = true;

  const onKeyUp: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    if (local.onKeyUp) {
      callHandler(e, local.onKeyUp);

      // @ts-ignore
      if (local.onKeyUp[ButtonRootSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onKeyUp);
  };

  // @ts-ignore
  onKeyUp[ButtonRootSymbol] = true;

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onClick) {
      callHandler(e, local.onClick);

      // @ts-ignore
      if (local.onClick[ButtonRootSymbol]) {
        return;
      }

      console.warn(
        "[kobalte]: use `onPress` instead of `onClick` for handling click interactions."
      );
    }

    callHandler(e, pressHandlers.onClick);
  };

  // @ts-ignore
  onClick[ButtonRootSymbol] = true;

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (local.onPointerDown) {
      callHandler(e, local.onPointerDown);

      // @ts-ignore
      if (local.onPointerDown[ButtonRootSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onPointerDown);
  };

  // @ts-ignore
  onPointerDown[ButtonRootSymbol] = true;

  const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (local.onPointerUp) {
      callHandler(e, local.onPointerUp);

      // @ts-ignore
      if (local.onPointerUp[ButtonRootSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onPointerUp);
  };

  // @ts-ignore
  onPointerUp[ButtonRootSymbol] = true;

  const onMouseDown: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onMouseDown) {
      callHandler(e, local.onMouseDown);

      // @ts-ignore
      if (local.onMouseDown[ButtonRootSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onMouseDown);
  };

  // @ts-ignore
  onMouseDown[ButtonRootSymbol] = true;

  const onDragStart: JSX.EventHandlerUnion<any, DragEvent> = e => {
    if (local.onDragStart) {
      callHandler(e, local.onDragStart);

      // @ts-ignore
      if (local.onDragStart[ButtonRootSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onDragStart);
  };

  // @ts-ignore
  onDragStart[ButtonRootSymbol] = true;

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
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
      onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
      onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
      {...others}
    />
  );
});

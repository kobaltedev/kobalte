/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/link/src/useLink.ts
 */

import {
  callHandler,
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  CREATE_PRESS_PROP_NAMES,
  createFocusRing,
  createHover,
  createPress,
  createTagName,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  HOVER_HANDLERS_PROP_NAMES,
  PRESS_HANDLERS_PROP_NAMES,
  PressEvents,
  PressSymbol,
} from "../primitives";

export interface LinkRootOptions extends PressEvents {
  /**
   * Whether the link is disabled.
   * Native navigation will be disabled, and the link will be exposed as disabled to assistive technology.
   */
  isDisabled?: boolean;

  /** Whether the link should not receive focus on press. */
  preventFocusOnPress?: boolean;

  /**
   * Whether press events should be canceled when the pointer leaves the link while pressed.
   *
   * By default, this is `false`, which means if the pointer returns over the link while
   * still pressed, onPressStart will be fired again.
   *
   * If set to `true`, the press is canceled when the pointer leaves the link and
   * onPressStart will not be fired if the pointer returns.
   */
  cancelOnPointerExit?: boolean;

  /** Whether text selection should be enabled on the link. */
  allowTextSelectionOnPress?: boolean;
}

/**
 * Link allows a user to navigate to another page or resource within a web page or application.
 */
export const LinkRoot = createPolymorphicComponent<"a", LinkRootOptions>(props => {
  let ref: HTMLAnchorElement | undefined;

  props = mergeDefaultProps({ as: "a" }, props);

  const [local, createPressProps, others] = splitProps(
    props,
    [
      "as",
      "ref",
      "isDisabled",
      ...PRESS_HANDLERS_PROP_NAMES,
      ...HOVER_HANDLERS_PROP_NAMES,
      ...FOCUS_RING_HANDLERS_PROP_NAMES,
    ],
    CREATE_PRESS_PROP_NAMES
  );

  const { isPressed, pressHandlers } = createPress<HTMLAnchorElement>(createPressProps);

  const { isHovered, hoverHandlers } = createHover({
    isDisabled: () => local.isDisabled,
  });

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

  const tagName = createTagName(
    () => ref,
    () => local.as || "a"
  );

  // Mark the handlers below as coming from a `createPress` primitive and prevent them from executing their
  // default behavior when a component that use `createPress` under the hood
  // is passed to the `as` prop of another component that use `createPress` under the hood.
  // This is necessary to prevent `createPress` logic being executed twice.
  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    if (local.onKeyDown) {
      callHandler(e, local.onKeyDown);

      // @ts-ignore
      if (local.onKeyDown[PressSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onKeyDown);
  };

  // @ts-ignore
  onKeyDown[PressSymbol] = true;

  const onKeyUp: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    if (local.onKeyUp) {
      callHandler(e, local.onKeyUp);

      // @ts-ignore
      if (local.onKeyUp[PressSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onKeyUp);
  };

  // @ts-ignore
  onKeyUp[PressSymbol] = true;

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onClick) {
      callHandler(e, local.onClick);

      // @ts-ignore
      if (local.onClick[PressSymbol]) {
        return;
      }

      console.warn(
        "[kobalte]: use `onPress` instead of `onClick` for handling click interactions."
      );
    }

    callHandler(e, pressHandlers.onClick);
  };

  // @ts-ignore
  onClick[PressSymbol] = true;

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (local.onPointerDown) {
      callHandler(e, local.onPointerDown);

      // @ts-ignore
      if (local.onPointerDown[PressSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onPointerDown);
  };

  // @ts-ignore
  onPointerDown[PressSymbol] = true;

  const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (local.onPointerUp) {
      callHandler(e, local.onPointerUp);

      // @ts-ignore
      if (local.onPointerUp[PressSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onPointerUp);
  };

  // @ts-ignore
  onPointerUp[PressSymbol] = true;

  const onMouseDown: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onMouseDown) {
      callHandler(e, local.onMouseDown);

      // @ts-ignore
      if (local.onMouseDown[PressSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onMouseDown);
  };

  // @ts-ignore
  onMouseDown[PressSymbol] = true;

  const onDragStart: JSX.EventHandlerUnion<any, DragEvent> = e => {
    if (local.onDragStart) {
      callHandler(e, local.onDragStart);

      // @ts-ignore
      if (local.onDragStart[PressSymbol]) {
        return;
      }
    }

    callHandler(e, pressHandlers.onDragStart);
  };

  // @ts-ignore
  onDragStart[PressSymbol] = true;

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      role={tagName() !== "a" ? "link" : undefined}
      tabIndex={tagName() !== "a" && !local.isDisabled ? 0 : undefined}
      aria-disabled={local.isDisabled ? true : undefined}
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

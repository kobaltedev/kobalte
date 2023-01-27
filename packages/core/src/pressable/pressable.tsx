import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { isButton } from "../button/is-button";
import {
  CREATE_LONG_PRESS_PROP_NAMES,
  CREATE_PRESS_PROP_NAMES,
  createLongPress,
  createPress,
  createTagName,
  PRESS_HANDLERS_PROP_NAMES,
  PressEvents,
  PressHandlers,
} from "../primitives";
import { LongPressEvents } from "../primitives/create-long-press/types";

export interface PressableOptions extends PressEvents, LongPressEvents {
  /** Whether the pressable is disabled. */
  isDisabled?: boolean;

  /** Whether the pressable should not receive focus on press. */
  preventFocusOnPress?: boolean;

  /**
   * Whether press events should be canceled when the pointer leaves the pressable while pressed.
   *
   * By default, this is `false`, which means if the pointer returns over the pressable while
   * still pressed, onPressStart will be fired again.
   *
   * If set to `true`, the press is canceled when the pointer leaves the pressable and
   * onPressStart will not be fired if the pointer returns.
   */
  cancelOnPointerExit?: boolean;

  /** Whether text selection should be enabled on the pressable. */
  allowTextSelectionOnPress?: boolean;

  /** The amount of time in milliseconds to wait before triggering a long press. */
  threshold?: number;
}

const PressableSymbol = Symbol("$$Pressable");

/**
 * `Pressable` handles press and long press interactions across mouse, touch, keyboard, and screen readers.
 * Supports a customizable time threshold, normalizes behavior across browsers and platforms,
 * and handles many nuances of dealing with pointer and keyboard events.
 * It renders a `<button>` by default.
 */
export const Pressable = createPolymorphicComponent<"button", PressableOptions>(props => {
  let ref: HTMLElement | undefined;

  props = mergeDefaultProps({ as: "button" }, props);

  const [local, createPressProps, createLongPressProps, others] = splitProps(
    props,
    ["as", "ref", "type", "isDisabled", ...PRESS_HANDLERS_PROP_NAMES],
    CREATE_PRESS_PROP_NAMES,
    CREATE_LONG_PRESS_PROP_NAMES
  );

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

  const { isPressed, pressHandlers } = createPress(createPressProps);

  const { longPressHandlers } = createLongPress(createLongPressProps);

  const pressableHandler = (
    name: keyof PressHandlers<any>,
    warningMessage: string | undefined = undefined
  ) => {
    const handler = (e: any) => {
      if (local[name]) {
        callHandler(e, local[name] as any);

        // Prevent the default behavior when a component that use `Pressable` under the hood
        // is passed to the `as` prop of another component that use `Pressable` under the hood.
        // @ts-ignore
        if (local[name][PressableSymbol]) {
          return;
        }

        if (warningMessage) {
          console.warn(warningMessage);
        }
      }

      callHandler(e, pressHandlers[name] as any);
      callHandler(e, longPressHandlers[name] as any);
    };

    // @ts-ignore
    handler[PressableSymbol] = true;

    return handler;
  };

  const onClick = pressableHandler(
    "onClick",
    "[kobalte]: use `onPress` instead of `onClick` for handling click interactions."
  );
  const onKeyDown = pressableHandler("onKeyDown");
  const onKeyUp = pressableHandler("onKeyUp");
  const onPointerDown = pressableHandler("onPointerDown");
  const onPointerUp = pressableHandler("onPointerUp");
  const onMouseDown = pressableHandler("onMouseDown");
  const onDragStart = pressableHandler("onDragStart");

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      type={isNativeButton() || isNativeInput() ? local.type : undefined}
      disabled={isNativeButton() || isNativeInput() ? local.isDisabled : undefined}
      aria-disabled={!isNativeButton() && !isNativeInput() && local.isDisabled ? true : undefined}
      data-disabled={local.isDisabled ? "" : undefined}
      data-active={isPressed() ? "" : undefined}
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

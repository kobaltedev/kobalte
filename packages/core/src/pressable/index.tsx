import { composeEventHandlers } from "@kobalte/utils";
import { JSX, splitProps, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  CREATE_LONG_PRESS_PROP_NAMES,
  CREATE_PRESS_PROP_NAMES,
  createLongPress,
  createPress,
  PRESS_HANDLERS_PROP_NAMES,
  PressEvents,
} from "../primitives";
import { LongPressEvents } from "../primitives/create-long-press/types";

export interface PressableProps
  extends PressEvents,
    LongPressEvents,
    JSX.HTMLAttributes<HTMLElement> {
  /** The component to render. */
  as: ValidComponent;

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

export function Pressable(props: PressableProps) {
  const [local, createPressProps, createLongPressProps, others] = splitProps(
    props,
    ["as", ...PRESS_HANDLERS_PROP_NAMES],
    CREATE_PRESS_PROP_NAMES,
    CREATE_LONG_PRESS_PROP_NAMES
  );

  const { isPressed, pressHandlers } = createPress<any>(createPressProps);

  const { longPressHandlers } = createLongPress(createLongPressProps);

  return (
    <Dynamic
      component={local.as}
      data-active={isPressed() ? "" : undefined}
      onKeyDown={composeEventHandlers([
        local.onKeyDown,
        pressHandlers.onKeyDown,
        longPressHandlers.onKeyDown,
      ])}
      onKeyUp={composeEventHandlers([
        local.onKeyUp,
        pressHandlers.onKeyUp,
        longPressHandlers.onKeyUp,
      ])}
      onClick={composeEventHandlers([
        local.onClick,
        pressHandlers.onClick,
        longPressHandlers.onClick,
      ])}
      onPointerDown={composeEventHandlers([
        local.onPointerDown,
        pressHandlers.onPointerDown,
        longPressHandlers.onPointerDown,
      ])}
      onPointerUp={composeEventHandlers([
        local.onPointerUp,
        pressHandlers.onPointerUp,
        longPressHandlers.onPointerUp,
      ])}
      onMouseDown={composeEventHandlers([
        local.onMouseDown,
        pressHandlers.onMouseDown,
        longPressHandlers.onMouseDown,
      ])}
      onDragStart={composeEventHandlers([
        local.onDragStart,
        pressHandlers.onDragStart,
        longPressHandlers.onDragStart,
      ])}
      {...others}
    />
  );
}

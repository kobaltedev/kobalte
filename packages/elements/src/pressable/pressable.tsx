import { chainHandlers, createPolymorphicComponent } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPress, CreatePressProps } from "../primitives";

export interface PressableProps extends CreatePressProps {}

/**
 * Handles press interactions across mouse, touch, keyboard, and screen readers.
 * It normalizes behavior across browsers and platforms, and handles many nuances
 * of dealing with pointer and keyboard events.
 *
 * It renders a `<button>` by default.
 */
export const Pressable = createPolymorphicComponent<"button", PressableProps>(props => {
  const [local, createPressProps, others] = splitProps(
    props,
    [
      "as",
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
      "disabled",
      "preventFocusOnPress",
      "cancelOnPointerExit",
      "allowTextSelectionOnPress",
    ]
  );

  const { isPressed, pressHandlers } = createPress<any>(createPressProps);

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    chainHandlers(e, [local.onKeyDown, pressHandlers.onKeyDown]);
  };

  const onKeyUp: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    chainHandlers(e, [local.onKeyUp, pressHandlers.onKeyUp]);
  };

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onClick) {
      console.warn("[kobalte]: onClick is deprecated, please use onPress");
    }

    chainHandlers(e, [local.onClick, pressHandlers.onClick]);
  };

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    chainHandlers(e, [local.onPointerDown, pressHandlers.onPointerDown]);
  };

  const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    chainHandlers(e, [local.onPointerUp, pressHandlers.onPointerUp]);
  };

  const onMouseDown: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    chainHandlers(e, [local.onMouseDown, pressHandlers.onMouseDown]);
  };

  const onDragStart: JSX.EventHandlerUnion<any, DragEvent> = e => {
    chainHandlers(e, [local.onDragStart, pressHandlers.onDragStart]);
  };

  return (
    <Dynamic
      component={local.as ?? "button"}
      data-pressed={isPressed() ? "" : undefined}
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

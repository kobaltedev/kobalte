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
      "onMouseDown",
      "onPointerUp",
      "onDragStart",
    ],
    [
      "onPressStart",
      "onPressEnd",
      "onPressUp",
      "onPressChange",
      "onPress",
      "pressed",
      "disabled",
      "preventFocusOnPress",
      "cancelOnPointerExit",
      "allowTextSelectionOnPress",
    ]
  );

  const { isPressed, pressHandlers } = createPress<HTMLButtonElement>(createPressProps);

  const tagName = createTagName(
    () => ref,
    () => "button"
  );

  const isNativeButton = createMemo(() => {
    const _tagName = tagName();
    return !!_tagName && isButton({ tagName: _tagName, type: local.type });
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

  const onMouseDown: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    chainHandlers(e, [local.onMouseDown, pressHandlers.onMouseDown]);
  };

  const onPointerUp: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    chainHandlers(e, [local.onPointerUp, pressHandlers.onPointerUp]);
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
      data-pressed={isPressed() ? "" : undefined}
      data-disabled={local.disabled ? "" : undefined}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onMouseDown={onMouseDown}
      onPointerUp={onPointerUp}
      onDragStart={onDragStart}
      {...others}
    />
  );
});

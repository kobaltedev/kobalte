/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-types/shared/src/events.d.ts
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/interactions/src/usePress.ts
 */

import { MaybeAccessor } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";

export type PointerType = "mouse" | "pen" | "touch" | "keyboard" | "virtual";

export interface PressEvent {
  /** The type of press event being fired. */
  type: "pressstart" | "pressend" | "pressup" | "press";

  /** The pointer type that triggered the press event. */
  pointerType: PointerType;

  /** The target element of the press event. */
  target: Element;

  /** Whether the shift keyboard modifier was held during the press event. */
  shiftKey: boolean;

  /** Whether the ctrl keyboard modifier was held during the press event. */
  ctrlKey: boolean;

  /** Whether the meta keyboard modifier was held during the press event. */
  metaKey: boolean;

  /** Whether the alt keyboard modifier was held during the press event. */
  altKey: boolean;
}

export interface PressEvents {
  /** Handler that is called when a press interaction starts. */
  onPressStart?: (event: PressEvent) => void;

  /**
   * Handler that is called when a press interaction ends,
   * either over the target or when the pointer leaves the target.
   */
  onPressEnd?: (event: PressEvent) => void;

  /**
   * Handler that is called when a press is released over the target,
   * regardless of whether it started on the target or not.
   */
  onPressUp?: (event: PressEvent) => void;

  /** Handler that is called when the press is released over the target. */
  onPress?: (event: PressEvent) => void;

  /** Handler that is called when the press state changes. */
  onPressChange?: (pressed: boolean) => void;
}

export interface CreatePressProps extends PressEvents {
  /** Whether the press events should be disabled. */
  disabled?: MaybeAccessor<boolean | undefined>;

  /** Whether the target should not receive focus on press. */
  preventFocusOnPress?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether press events should be canceled when the pointer leaves the target while pressed.
   *
   * By default, this is `false`, which means if the pointer returns over the target while
   * still pressed, onPressStart will be fired again.
   *
   * If set to `true`, the press is canceled when the pointer leaves the target and
   * onPressStart will not be fired if the pointer returns.
   */
  cancelOnPointerExit?: MaybeAccessor<boolean | undefined>;

  /** Whether text selection should be enabled on the pressable element. */
  allowTextSelectionOnPress?: MaybeAccessor<boolean | undefined>;
}

export interface PressProps<T extends HTMLElement> {
  onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
  onKeyUp: JSX.EventHandlerUnion<T, KeyboardEvent>;
  onClick: JSX.EventHandlerUnion<T, MouseEvent>;
  onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
  onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
  onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
  onDragStart: JSX.EventHandlerUnion<T, DragEvent>;
}

export interface CreatePressResult<T extends HTMLElement> {
  /** Whether the target is currently pressed. */
  isPressed: Accessor<boolean>;

  /** Props to spread onto the target element. */
  pressProps: PressProps<T>;
}

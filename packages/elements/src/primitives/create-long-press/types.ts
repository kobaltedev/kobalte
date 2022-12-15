/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-types/shared/src/events.d.ts
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/interactions/src/useLongPress.ts
 */

import { MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { PressEvent, PressHandlers } from "../create-press";

export interface LongPressEvent extends Omit<PressEvent, "type"> {
  /** The type of long press event being fired. */
  type: "longpressstart" | "longpressend" | "longpress";
}

export interface CreateLongPressProps {
  /** Whether long press events should be disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /** The amount of time in milliseconds to wait before triggering a long press. */
  threshold?: MaybeAccessor<number | undefined>;

  /** Handler that is called when a long press interaction starts. */
  onLongPressStart?: (e: LongPressEvent) => void;

  /**
   * Handler that is called when a long press interaction ends, either
   * over the target or when the pointer leaves the target.
   */
  onLongPressEnd?: (e: LongPressEvent) => void;

  /** Handler that is called when the threshold time is met while the press is over the target. */
  onLongPress?: (e: LongPressEvent) => void;
}

export interface CreateLongPressResult<T extends HTMLElement> {
  /** Whether the target is currently pressed. */
  isPressed: Accessor<boolean>;

  /** Event handlers to spread onto the target element. */
  longPressHandlers: PressHandlers<T>;
}

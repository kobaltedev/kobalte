/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/focus/src/useFocusRing.ts
 */

import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createSignal, JSX } from "solid-js";

import { createFocusVisibleListener } from "../create-focus-visible";

export interface CreateFocusRingProps {
  /**
   * Whether to show the focus ring when something
   * inside the container element has focus (true), or
   * only if the container itself has focus (false).
   */
  within?: MaybeAccessor<boolean | undefined>;

  /** Whether the element is a text input. */
  isTextInput?: MaybeAccessor<boolean | undefined>;

  /** Handler that is called when the focus state changes. */
  onFocusChange?: (isFocused: boolean) => void;

  /** Handler that is called when the focus-visible state changes. */
  onFocusVisibleChange?: (isFocusVisible: boolean) => void;
}

export interface FocusRingHandlers<T extends HTMLElement> {
  onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
  onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface CreateFocusRingResult<T extends HTMLElement> {
  /** Whether the element is currently focused. */
  isFocused: Accessor<boolean>;

  /** Whether the focus ring should be visible to indicate keyboard focus. */
  isFocusVisible: Accessor<boolean>;

  /** Event handlers to apply to the container element with the focus ring. */
  focusRingHandlers: FocusRingHandlers<T>;
}

/**
 * Determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard,
 * not with a mouse, touch, or other input methods.
 */
export function createFocusRing<T extends HTMLElement>(
  props: CreateFocusRingProps = {}
): CreateFocusRingResult<T> {
  const [isFocused, setIsFocused] = createSignal(false);
  const [isFocusVisible, setIsFocusVisible] = createSignal(false);
  const [isFocusRingVisible, setIsFocusRingVisible] = createSignal(false);

  createFocusVisibleListener(setIsFocusVisible, [], () => !!access(props.isTextInput));

  const shouldPreventFocusWithin = (e: FocusEvent) => {
    return !access(props.within) && e.currentTarget !== e.target;
  };

  const updateStateAndNotifyHandlers = (newIsFocused: boolean) => {
    const newIsFocusRingVisible = newIsFocused && isFocusVisible();

    setIsFocused(newIsFocused);
    setIsFocusRingVisible(newIsFocusRingVisible);

    props.onFocusChange?.(newIsFocused);
    props.onFocusVisibleChange?.(newIsFocusRingVisible);
  };

  const onFocusIn: JSX.EventHandlerUnion<T, FocusEvent> = e => {
    if (shouldPreventFocusWithin(e)) {
      return;
    }

    updateStateAndNotifyHandlers(true);
  };

  const onFocusOut: JSX.EventHandlerUnion<T, FocusEvent> = e => {
    if (shouldPreventFocusWithin(e)) {
      return;
    }

    updateStateAndNotifyHandlers(false);
  };

  return {
    isFocused,
    isFocusVisible: isFocusRingVisible,
    focusRingHandlers: {
      onFocusIn,
      onFocusOut,
    },
  };
}

/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/focus/src/useFocusRing.ts
 */

import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, JSX } from "solid-js";

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

  /** Whether the element will be autofocused. */
  autoFocus?: MaybeAccessor<boolean | undefined>;
}

export interface CreateFocusRingResult {
  /** Whether the element is currently focused. */
  isFocused: Accessor<boolean>;

  /** Whether keyboard focus should be visible. */
  isFocusVisible: Accessor<boolean>;

  /** Event handlers to apply to the container element with the focus ring. */
  focusHandlers: {
    onFocusIn: JSX.EventHandlerUnion<any, FocusEvent>;
    onFocusOut: JSX.EventHandlerUnion<any, FocusEvent>;
  };
}

/**
 * Determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard,
 * not with a mouse, touch, or other input methods.
 */
export function createFocusRing(props: CreateFocusRingProps = {}): CreateFocusRingResult {
  const [isFocused, setIsFocused] = createSignal(false);
  const [isFocusVisibleState, setIsFocusVisibleState] = createSignal(false);

  createFocusVisibleListener(setIsFocusVisibleState, [], () => !!access(props.isTextInput));

  const isFocusVisible = createMemo(() => {
    return isFocused() && isFocusVisibleState();
  });

  const shouldPreventFocusWithin = (e: FocusEvent) => {
    return !access(props.within) && e.currentTarget !== e.target;
  };

  const onFocusIn: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    if (shouldPreventFocusWithin(e)) {
      return;
    }

    setIsFocused(true);
  };

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    if (shouldPreventFocusWithin(e)) {
      return;
    }

    setIsFocused(false);
  };

  return {
    isFocused,
    isFocusVisible,
    focusHandlers: {
      onFocusIn,
      onFocusOut,
    },
  };
}

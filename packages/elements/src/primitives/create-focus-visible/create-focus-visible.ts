/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/interactions/src/useFocusVisible.ts
 */

// Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions

import { access, isMac, isVirtualClick, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, createSignal, on, onCleanup, onMount } from "solid-js";

type Modality = "keyboard" | "pointer" | "virtual";
type HandlerEvent = PointerEvent | MouseEvent | KeyboardEvent | FocusEvent;
type Handler = (modality: Modality, e: HandlerEvent | null) => void;
type FocusVisibleHandler = (isFocusVisible: boolean) => void;

let hasSetupGlobalListeners = false;
let currentModality: Modality | null = null;
let hasEventBeforeFocus = false;
let hasBlurredWindowRecently = false;

const changeHandlers = new Set<Handler>();

function triggerChangeHandlers(modality: Modality, e: HandlerEvent | null) {
  for (const handler of changeHandlers) {
    handler(modality, e);
  }
}

/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus styles visible.
 */
function isValidKey(e: KeyboardEvent) {
  // Control and Shift keys trigger when navigating back to the tab with keyboard.
  return !(
    e.metaKey ||
    (!isMac() && e.altKey) ||
    e.ctrlKey ||
    e.key === "Control" ||
    e.key === "Shift" ||
    e.key === "Meta"
  );
}

function handleKeyboardEvent(e: KeyboardEvent) {
  hasEventBeforeFocus = true;
  if (isValidKey(e)) {
    currentModality = "keyboard";
    triggerChangeHandlers("keyboard", e);
  }
}

function handlePointerEvent(e: PointerEvent | MouseEvent) {
  currentModality = "pointer";
  if (e.type === "mousedown" || e.type === "pointerdown") {
    hasEventBeforeFocus = true;

    const target = e.composedPath ? e.composedPath()[0] : e.target;
    if ((target as HTMLElement).matches(":focus-visible")) {
      return;
    }

    triggerChangeHandlers("pointer", e);
  }
}

function handleClickEvent(e: MouseEvent) {
  if (isVirtualClick(e)) {
    hasEventBeforeFocus = true;
    currentModality = "virtual";
  }
}

function handleWindowFocus(e: FocusEvent) {
  // Firefox fires two extra focus events when the user first clicks into an iframe:
  // first on the window, then on the document. We ignore these events so they don't
  // cause keyboard focus rings to appear.
  if (e.target === window || e.target === document) {
    return;
  }

  // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
  // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
  if (!hasEventBeforeFocus && !hasBlurredWindowRecently) {
    currentModality = "virtual";
    triggerChangeHandlers("virtual", e);
  }

  hasEventBeforeFocus = false;
  hasBlurredWindowRecently = false;
}

function handleWindowBlur() {
  // When the window is blurred, reset state. This is necessary when tabbing out of the window,
  // for example, since a subsequent focus event won't be fired.
  hasEventBeforeFocus = false;
  hasBlurredWindowRecently = true;
}

/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */
function setupGlobalFocusEvents() {
  if (typeof window === "undefined" || hasSetupGlobalListeners) {
    return;
  }

  // Programmatic focus() calls shouldn't affect the current input modality.
  // However, we need to detect other cases when a focus event occurs without
  // a preceding user event (e.g. screen reader focus). Overriding the focus
  // method on HTMLElement.prototype is a bit hacky, but works.
  const { focus } = HTMLElement.prototype;
  HTMLElement.prototype.focus = function (...args) {
    hasEventBeforeFocus = true;
    focus.apply(this, args);
  };

  document.addEventListener("keydown", handleKeyboardEvent, true);
  document.addEventListener("keyup", handleKeyboardEvent, true);
  document.addEventListener("click", handleClickEvent, true);

  window.addEventListener("focus", handleWindowFocus, true);
  window.addEventListener("blur", handleWindowBlur, false);

  document.addEventListener("pointerdown", handlePointerEvent, true);
  document.addEventListener("pointermove", handlePointerEvent, true);
  document.addEventListener("pointerup", handlePointerEvent, true);

  hasSetupGlobalListeners = true;
}

export function isFocusVisible(): boolean {
  return currentModality !== "pointer";
}

export function getInteractionModality() {
  return currentModality;
}

export function setInteractionModality(modality: Modality) {
  currentModality = modality;
  triggerChangeHandlers(modality, null);
}

/**
 * Keeps state of the current modality.
 */
export function createInteractionModality() {
  setupGlobalFocusEvents();

  const [modality, setModality] = createSignal(currentModality);

  onMount(() => {
    const handler = () => {
      setModality(currentModality);
    };

    changeHandlers.add(handler);

    onCleanup(() => {
      changeHandlers.delete(handler);
    });
  });

  return modality;
}

/**
 * If this is attached to text input component, return if the event is a focus event (Tab/Escape keys pressed) so that
 * focus visible style can be properly set.
 */
function isKeyboardFocusEvent(isTextInput: boolean, modality: Modality, e: HandlerEvent | null) {
  return !(
    isTextInput &&
    modality === "keyboard" &&
    e instanceof KeyboardEvent &&
    // Only Tab or Esc keys will make focus visible on text input elements
    !(e.key === "Tab" || e.key === "Escape")
  );
}

export interface CreateFocusVisibleProps {
  /** Whether the element is a text input. */
  isTextInput?: MaybeAccessor<boolean | undefined>;

  /** Whether the element will be autofocused. */
  autoFocus?: MaybeAccessor<boolean | undefined>;
}

export interface CreateFocusVisibleResult {
  /** Whether keyboard focus is visible globally. */
  isFocusVisible: Accessor<boolean>;
}

/**
 * Manages focus visible state for the page, and subscribes individual components for updates.
 */
export function createFocusVisible(props: CreateFocusVisibleProps = {}): CreateFocusVisibleResult {
  const [isFocusVisibleState, setIsFocusVisibleState] = createSignal(
    access(props.autoFocus) || isFocusVisible()
  );

  const isTextInput = () => !!access(props.isTextInput);

  createFocusVisibleListener(setIsFocusVisibleState, [isTextInput], isTextInput);

  return { isFocusVisible: isFocusVisibleState };
}

/**
 * Listens for trigger change and reports if focus is visible (i.e., modality is not pointer).
 */
export function createFocusVisibleListener(
  fn: FocusVisibleHandler,
  deps: Array<Accessor<any>>,
  isTextInput: Accessor<boolean>
): void {
  setupGlobalFocusEvents();

  createEffect(
    on(deps, () => {
      const handler: Handler = (modality, e) => {
        if (!isKeyboardFocusEvent(isTextInput(), modality, e)) {
          return;
        }

        fn(isFocusVisible());
      };

      changeHandlers.add(handler);

      onCleanup(() => {
        changeHandlers.delete(handler);
      });
    })
  );
}

/* -------------------------------------------------------------------------------------------------
 * Setup
 * -----------------------------------------------------------------------------------------------*/

if (typeof document !== "undefined") {
  if (document.readyState !== "loading") {
    setupGlobalFocusEvents();
  } else {
    document.addEventListener("DOMContentLoaded", setupGlobalFocusEvents);
  }
}

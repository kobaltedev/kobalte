/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/interactions/src/usePress.ts
 */

import {
  access,
  createGlobalListeners,
  EventKey,
  focusWithoutScrolling,
  isVirtualClick,
  isVirtualPointerEvent,
} from "@kobalte/utils";
import { createEffect, createSignal, JSX, on, onCleanup } from "solid-js";

import { disableTextSelection, restoreTextSelection } from "./text-selection";
import { CreatePressProps, CreatePressResult, PointerType } from "./types";

interface EventBase {
  currentTarget: EventTarget | null;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface EventPoint {
  clientX: number;
  clientY: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
}

interface PressState {
  isPressed: boolean;
  ignoreEmulatedMouseEvents: boolean;
  ignoreClickAfterPress: boolean;
  didFirePressStart: boolean;
  activePointerId: any;
  isOverTarget: boolean;
  target: HTMLElement | null;
  pointerType: PointerType | null;
}

/**
 * Handles press interactions across mouse, touch, keyboard, and screen readers.
 * It normalizes behavior across browsers and platforms, and handles many nuances
 * of dealing with pointer and keyboard events.
 * @param props - Props for the press primitive.
 */
export function createPress<T extends HTMLElement>(props: CreatePressProps): CreatePressResult<T> {
  const [isPressed, setIsPressed] = createSignal(false);

  const state: PressState = {
    isPressed: false,
    ignoreEmulatedMouseEvents: false,
    ignoreClickAfterPress: false,
    didFirePressStart: false,
    activePointerId: null,
    isOverTarget: false,
    target: null,
    pointerType: null,
  };

  const { addGlobalListener, removeAllGlobalListeners } = createGlobalListeners();

  const triggerPressStart = (originalEvent: EventBase, pointerType: PointerType) => {
    if (access(props.disabled) || state.didFirePressStart) {
      return;
    }

    props.onPressStart?.({
      type: "pressstart",
      pointerType,
      target: originalEvent.currentTarget as HTMLElement,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
    });

    props.onPressChange?.(true);

    state.didFirePressStart = true;
    setIsPressed(true);
  };

  const triggerPressEnd = (
    originalEvent: EventBase,
    pointerType: PointerType,
    wasPressed = true
  ) => {
    if (!state.didFirePressStart) {
      return;
    }

    state.ignoreClickAfterPress = true;
    state.didFirePressStart = false;

    props.onPressEnd?.({
      type: "pressend",
      pointerType,
      target: originalEvent.currentTarget as HTMLElement,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
    });

    props.onPressChange?.(false);
    setIsPressed(false);

    if (wasPressed && !access(props.disabled)) {
      props.onPress?.({
        type: "press",
        pointerType,
        target: originalEvent.currentTarget as HTMLElement,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey,
      });
    }
  };

  const triggerPressUp = (originalEvent: EventBase, pointerType: PointerType) => {
    if (access(props.disabled)) {
      return;
    }

    props.onPressUp?.({
      type: "pressup",
      pointerType,
      target: originalEvent.currentTarget as HTMLElement,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
    });
  };

  const cancel = (e: EventBase) => {
    if (!state.isPressed) {
      return;
    }

    if (state.isOverTarget) {
      triggerPressEnd(createEvent(state.target!, e), state.pointerType!, false);
    }

    state.isPressed = false;
    state.isOverTarget = false;
    state.activePointerId = null;
    state.pointerType = null;

    removeAllGlobalListeners();

    if (!access(props.allowTextSelectionOnPress)) {
      restoreTextSelection(state.target ?? undefined);
    }
  };

  const globalOnKeyUp = (e: KeyboardEvent) => {
    if (state.isPressed && isValidKeyboardEvent(e, state.target!)) {
      if (shouldPreventDefaultKeyboard(e.target as Element, e.key)) {
        e.preventDefault();
      }

      e.stopPropagation();

      state.isPressed = false;
      const target = e.target as HTMLElement;

      triggerPressEnd(createEvent(state.target!, e), "keyboard", state.target?.contains(target));

      removeAllGlobalListeners();

      // If the target is a link, trigger the click method to open the URL,
      // but defer triggering pressEnd until onClick event handler.
      if (
        state.target instanceof HTMLElement &&
        state.target.contains(target) &&
        (isHTMLAnchorLink(state.target) || state.target.getAttribute("role") === "link")
      ) {
        state.target.click();
      }
    }
  };

  // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
  // Use pointer move events instead to implement our own hit testing.
  // See https://bugs.webkit.org/show_bug.cgi?id=199803
  const globalOnPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== state.activePointerId) {
      return;
    }

    if (isPointOverTarget(e, state.target!)) {
      if (!state.isOverTarget) {
        state.isOverTarget = true;
        triggerPressStart(createEvent(state.target!, e), state.pointerType!);
      }
    } else if (state.isOverTarget) {
      state.isOverTarget = false;
      triggerPressEnd(createEvent(state.target!, e), state.pointerType!, false);

      if (access(props.cancelOnPointerExit)) {
        cancel(e);
      }
    }
  };

  const globalOnPointerUp = (e: PointerEvent) => {
    if (e.pointerId === state.activePointerId && state.isPressed && e.button === 0) {
      if (isPointOverTarget(e, state.target!)) {
        triggerPressEnd(createEvent(state.target!, e), state.pointerType!);
      } else if (state.isOverTarget) {
        triggerPressEnd(createEvent(state.target!, e), state.pointerType!, false);
      }

      state.isPressed = false;
      state.isOverTarget = false;
      state.activePointerId = null;
      state.pointerType = null;

      removeAllGlobalListeners();

      if (!access(props.allowTextSelectionOnPress)) {
        restoreTextSelection(state.target ?? undefined);
      }
    }
  };

  const globalOnPointerCancel = (e: PointerEvent) => {
    cancel(e);
  };

  const onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent> = e => {
    if (isValidKeyboardEvent(e, e.currentTarget) && e.currentTarget.contains(e.target as Element)) {
      if (shouldPreventDefaultKeyboard(e.target as Element, e.key)) {
        e.preventDefault();
      }
      e.stopPropagation();

      // If the event is repeating, it may have started on a different element
      // after which focus moved to the current element. Ignore these events and
      // only handle the first key down event.
      if (!state.isPressed && !e.repeat) {
        state.target = e.currentTarget;
        state.isPressed = true;
        triggerPressStart(e, "keyboard");

        // Focus may move before the key up event, so register the event on the document
        // instead of the same element where the key down event occurred.
        addGlobalListener(document, "keyup", globalOnKeyUp, false);
      }
    } else if (e.key === EventKey.Enter && isHTMLAnchorLink(e.currentTarget)) {
      // If the target is a link, we won't have handled this above because we want the default
      // browser behavior to open the link when pressing Enter. But we still need to prevent
      // default so that elements above do not also handle it (e.g. table row).
      e.stopPropagation();
    }
  };

  const onKeyUp: JSX.EventHandlerUnion<T, KeyboardEvent> = e => {
    if (
      isValidKeyboardEvent(e, e.currentTarget) &&
      !e.repeat &&
      e.currentTarget.contains(e.target as Element)
    ) {
      triggerPressUp(createEvent(state.target!, e), "keyboard");
    }
  };

  const onClick: JSX.EventHandlerUnion<T, MouseEvent> = e => {
    if (e && !e.currentTarget.contains(e.target as Element)) {
      return;
    }

    if (e && e.button === 0) {
      e.stopPropagation();

      if (access(props.disabled)) {
        e.preventDefault();
      }

      // If triggered from a screen reader or by using element.click(),
      // trigger as if it were a keyboard click.
      if (
        !state.ignoreClickAfterPress &&
        !state.ignoreEmulatedMouseEvents &&
        (state.pointerType === "virtual" || isVirtualClick(e))
      ) {
        // Ensure the element receives focus (VoiceOver on iOS does not do this)
        if (!access(props.disabled) && !access(props.preventFocusOnPress)) {
          focusWithoutScrolling(e.currentTarget);
        }

        triggerPressStart(e, "virtual");
        triggerPressUp(e, "virtual");
        triggerPressEnd(e, "virtual");
      }

      state.ignoreEmulatedMouseEvents = false;
      state.ignoreClickAfterPress = false;
    }
  };

  const onPointerDown: JSX.EventHandlerUnion<T, PointerEvent> = e => {
    // Only handle left clicks, and ignore events that bubbled through portals.
    if (e.button !== 0 || !e.currentTarget.contains(e.target as HTMLElement)) {
      return;
    }

    // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
    // Ignore and let the onClick handler take care of it instead.
    // https://bugs.webkit.org/show_bug.cgi?id=222627
    // https://bugs.webkit.org/show_bug.cgi?id=223202
    if (isVirtualPointerEvent(e)) {
      state.pointerType = "virtual";
      return;
    }

    // Due to browser inconsistencies, especially on mobile browsers, we prevent
    // default on pointer down and handle focusing the pressable element ourselves.
    if (shouldPreventDefault(e.currentTarget as HTMLElement)) {
      e.preventDefault();
    }

    state.pointerType = e.pointerType as PointerType;

    e.stopPropagation();

    if (state.isPressed) {
      return;
    }

    state.isPressed = true;
    state.isOverTarget = true;
    state.activePointerId = e.pointerId;
    state.target = e.currentTarget;

    if (!access(props.disabled) && !access(props.preventFocusOnPress)) {
      focusWithoutScrolling(e.currentTarget);
    }

    if (!access(props.allowTextSelectionOnPress)) {
      disableTextSelection(state.target ?? undefined);
    }

    triggerPressStart(e, state.pointerType);

    addGlobalListener(document, "pointermove", globalOnPointerMove, false);
    addGlobalListener(document, "pointerup", globalOnPointerUp, false);
    addGlobalListener(document, "pointercancel", globalOnPointerCancel, false);
  };

  const onPointerUp: JSX.EventHandlerUnion<T, PointerEvent> = e => {
    // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
    if (!e.currentTarget.contains(e.target as Element) || state.pointerType === "virtual") {
      return;
    }

    // Only handle left clicks
    // Safari on iOS sometimes fires pointerup events, even
    // when the touch isn't over the target, so double check.
    if (e.button === 0 && isPointOverTarget(e, e.currentTarget)) {
      triggerPressUp(e, state.pointerType ?? (e.pointerType as PointerType));
    }
  };

  const onMouseDown: JSX.EventHandlerUnion<T, MouseEvent> = e => {
    if (!e.currentTarget.contains(e.target as HTMLElement)) {
      return;
    }

    if (e.button === 0) {
      // Chrome and Firefox on touch Windows devices require mouse down events
      // to be canceled in addition to pointer events, or an extra asynchronous
      // focus event will be fired.
      if (shouldPreventDefault(e.currentTarget as HTMLElement)) {
        e.preventDefault();
      }

      e.stopPropagation();
    }
  };

  const onDragStart: JSX.EventHandlerUnion<T, DragEvent> = e => {
    if (!e.currentTarget.contains(e.target as Element)) {
      return;
    }

    // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
    cancel(e);
  };

  // Remove user-select: none in case component unmounts immediately after pressStart
  createEffect(
    on(
      () => access(props.allowTextSelectionOnPress),
      allowTextSelectionOnPress => {
        onCleanup(() => {
          if (!allowTextSelectionOnPress) {
            restoreTextSelection(state.target ?? undefined);
          }
        });
      }
    )
  );

  return {
    isPressed,
    pressHandlers: {
      onKeyDown,
      onKeyUp,
      onClick,
      onPointerDown,
      onPointerUp,
      onMouseDown,
      onDragStart,
    },
  };
}

function isHTMLAnchorLink(target: Element): boolean {
  return target.tagName === "A" && target.hasAttribute("href");
}

function isValidKeyboardEvent(event: KeyboardEvent, currentTarget: Element): boolean {
  const { key, code } = event;
  const element = currentTarget as HTMLElement;
  const role = element.getAttribute("role");

  // Accessibility for keyboards. Space and Enter only.
  return (
    (key === EventKey.Enter || key === EventKey.Space || code === "Space") &&
    !(
      (element instanceof HTMLInputElement && !isValidInputKey(element, key)) ||
      element instanceof HTMLTextAreaElement ||
      element.isContentEditable
    ) &&
    // A link with a valid href should be handled natively,
    // unless it also has role='button' and was triggered using Space.
    (!isHTMLAnchorLink(element) || (role === "button" && key !== EventKey.Enter)) &&
    // An element with role='link' should only trigger with Enter key
    !(role === "link" && key !== EventKey.Enter)
  );
}

function createEvent(target: HTMLElement, e: EventBase): EventBase {
  return {
    currentTarget: target,
    shiftKey: e.shiftKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
  };
}

function getPointClientRect(point: EventPoint): Rect {
  const offsetX = (point.width ?? 0) / 2 || point.radiusX || 0;
  const offsetY = (point.height ?? 0) / 2 || point.radiusY || 0;

  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX,
  };
}

function areRectanglesOverlapping(a: Rect, b: Rect) {
  // check if they cannot overlap on x-axis
  if (a.left > b.right || b.left > a.right) {
    return false;
  }

  // check if they cannot overlap on y-axis
  if (a.top > b.bottom || b.top > a.bottom) {
    return false;
  }

  return true;
}

function isPointOverTarget(point: EventPoint, target: Element) {
  const rect = target.getBoundingClientRect();
  const pointRect = getPointClientRect(point);
  return areRectanglesOverlapping(rect, pointRect);
}

function shouldPreventDefault(target: Element) {
  // We cannot prevent default if the target is a draggable element.
  return !(target instanceof HTMLElement) || !target.draggable;
}

function shouldPreventDefaultKeyboard(target: Element, key: string) {
  if (target instanceof HTMLInputElement) {
    return !isValidInputKey(target, key);
  }

  if (target instanceof HTMLButtonElement) {
    return target.type !== "submit";
  }

  return true;
}

const NON_TEXT_INPUT_TYPES = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset",
]);

function isValidInputKey(target: HTMLInputElement, key: string) {
  // Only space should toggle checkboxes and radios, not enter.
  return target.type === "checkbox" || target.type === "radio"
    ? key === EventKey.Space
    : NON_TEXT_INPUT_TYPES.has(target.type);
}

/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/2bcc2f0b45ea8b20621458a93f1804a3f9df9ac4/packages/@react-aria/interactions/src/useHover.ts
 */

// Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions

import { access } from "@kobalte/utils";
import { createEffect, createSignal, JSX, on, onCleanup, onMount } from "solid-js";

import { PointerType } from "../create-press";
import { CreateHoverProps, CreateHoverResult } from "./types";

// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events, so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

function setGlobalIgnoreEmulatedMouseEvents() {
  globalIgnoreEmulatedMouseEvents = true;

  // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
  // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
  // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
  // the distant future because a user previously touched the element.
  setTimeout(() => {
    globalIgnoreEmulatedMouseEvents = false;
  }, 50);
}

function handleGlobalPointerEvent(e: PointerEvent) {
  if (e.pointerType === "touch") {
    setGlobalIgnoreEmulatedMouseEvents();
  }
}

function setupGlobalTouchEvents() {
  if (typeof document === "undefined") {
    return;
  }

  document.addEventListener("pointerup", handleGlobalPointerEvent);

  hoverCount++;

  return () => {
    hoverCount--;

    if (hoverCount > 0) {
      return;
    }

    document.removeEventListener("pointerup", handleGlobalPointerEvent);
  };
}

interface HoverState {
  isHovered: boolean;
  ignoreEmulatedMouseEvents: boolean;
  target: HTMLElement | null;
  pointerType: PointerType | null;
}

export const HOVER_HANDLERS_PROP_NAMES = ["onPointerEnter", "onPointerLeave"] as const;

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 */
export function createHover<T extends HTMLElement>(
  props: CreateHoverProps = {}
): CreateHoverResult<T> {
  const [isHovered, setIsHovered] = createSignal(false);

  const state: HoverState = {
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: null,
    target: null,
  };

  const triggerHoverStart = (event: Event, pointerType: PointerType) => {
    state.pointerType = pointerType;

    const eventCurrentTarget = event.currentTarget as HTMLElement | null;
    const eventTarget = event.target as HTMLElement | null;

    if (
      access(props.isDisabled) ||
      pointerType === "touch" ||
      state.isHovered ||
      !eventCurrentTarget?.contains(eventTarget)
    ) {
      return;
    }

    state.isHovered = true;
    state.target = eventCurrentTarget;

    props.onHoverStart?.({
      type: "hoverstart",
      target: eventCurrentTarget,
      pointerType,
    });

    props.onHoverChange?.(true);

    setIsHovered(true);
  };

  const triggerHoverEnd = (event: Event, pointerType: PointerType) => {
    state.pointerType = null;
    state.target = null;

    if (pointerType === "touch" || !state.isHovered) {
      return;
    }

    state.isHovered = false;

    props.onHoverEnd?.({
      type: "hoverend",
      target: event.currentTarget as HTMLElement,
      pointerType,
    });

    props.onHoverChange?.(false);

    setIsHovered(false);
  };

  const onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent> = e => {
    if (globalIgnoreEmulatedMouseEvents && e.pointerType === "mouse") {
      return;
    }

    triggerHoverStart(e, e.pointerType as PointerType);
  };

  const onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent> = e => {
    if (!access(props.isDisabled) && e.currentTarget.contains(e.target as Element)) {
      triggerHoverEnd(e, e.pointerType as PointerType);
    }
  };

  onMount(() => {
    const cleanupFn = setupGlobalTouchEvents();

    onCleanup(() => cleanupFn?.());
  });

  createEffect(
    on(
      () => access(props.isDisabled),
      disabled => {
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (disabled) {
          triggerHoverEnd(
            { currentTarget: state.target } as Event,
            state.pointerType as PointerType
          );
        }
      }
    )
  );

  return {
    isHovered,
    hoverHandlers: {
      onPointerEnter,
      onPointerLeave,
    },
  };
}

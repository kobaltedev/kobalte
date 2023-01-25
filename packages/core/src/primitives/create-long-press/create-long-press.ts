/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/interactions/src/useLongPress.ts
 */

import { access, createGlobalListeners, mergeDefaultProps } from "@kobalte/utils";

import { createPress, PressEvent } from "../create-press";
import { CreateLongPressProps, CreateLongPressResult } from "./types";

export const CREATE_LONG_PRESS_PROP_NAMES = [
  "onLongPressStart",
  "onLongPressEnd",
  "onLongPress",
  "isDisabled",
  "threshold",
] as const;

/**
 * Handles long press interactions across mouse and touch devices. Supports a customizable time threshold,
 * accessibility description, and normalizes behavior across browsers and devices.
 */
export function createLongPress<T extends HTMLElement>(
  props: CreateLongPressProps
): CreateLongPressResult<T> {
  props = mergeDefaultProps({ threshold: 500 }, props);

  let timeoutId: number | undefined;

  const { addGlobalListener, removeGlobalListener } = createGlobalListeners();

  const isDisabled = () => access(props.isDisabled) ?? false;

  const onPressStart = (e: PressEvent) => {
    if (e.pointerType === "mouse" || e.pointerType === "touch") {
      props.onLongPressStart?.({
        ...e,
        type: "longpressstart",
      });

      timeoutId = window.setTimeout(() => {
        // Prevent other usePress handlers from also handling this event.
        e.target.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true }));

        props.onLongPress?.({
          ...e,
          type: "longpress",
        });

        timeoutId = undefined;
      }, access(props.threshold)!);

      // Prevent context menu, which may be opened on long press on touch devices
      if (e.pointerType === "touch") {
        const onContextMenu = (e: Event) => {
          e.preventDefault();
        };

        addGlobalListener(e.target, "contextmenu", onContextMenu, { once: true });
        addGlobalListener(
          window,
          "pointerup",
          () => {
            // If no contextmenu event is fired quickly after pointerup, remove the handler
            // so future context menu events outside a long press are not prevented.
            setTimeout(() => {
              removeGlobalListener(e.target, "contextmenu", onContextMenu);
            }, 30);
          },
          { once: true }
        );
      }
    }
  };

  const onPressEnd = (e: PressEvent) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    if (e.pointerType === "mouse" || e.pointerType === "touch") {
      props.onLongPressEnd?.({
        ...e,
        type: "longpressend",
      });
    }
  };

  const { isPressed, pressHandlers: longPressHandlers } = createPress({
    isDisabled,
    onPressStart,
    onPressEnd,
  });

  return { isPressed, longPressHandlers };
}

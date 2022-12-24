/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/src/useInteractOutside.ts
 */

import { access, getDocument, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface CreateInteractOutsideProps {
  /** Whether the interact outside events should be disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /** Handler that is called when an interaction outside the `ref` element start. */
  onInteractOutsideStart?: (e: Event) => void;

  /** Handler that is called when interaction outside the `ref` element end. */
  onInteractOutside?: (e: Event) => void;
}

/**
 * Handles interaction outside a given element.
 * Used in components like Dialogs and Popovers, so they can close when a user clicks outside them.
 * @param props - Props of the primitive.
 * @param ref - A ref for the HTML element.
 */
export function createInteractOutside(
  props: CreateInteractOutsideProps,
  ref: Accessor<Element | undefined>
) {
  const [isPointerDown, setIsPointerDown] = createSignal(false);

  createEffect(() => {
    if (access(props.isDisabled)) {
      return;
    }

    const onPointerDown = (e: PointerEvent) => {
      if (isInteractOutsideEvent(e, ref())) {
        props.onInteractOutsideStart?.(e);
        setIsPointerDown(true);
      }
    };

    const onPointerUp = (e: PointerEvent | MouseEvent) => {
      if (isPointerDown() && isInteractOutsideEvent(e, ref())) {
        setIsPointerDown(false);
        props.onInteractOutside?.(e);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);

    onCleanup(() => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
    });
  });
}

/**
 * Returns whether the event is a valid interact outside event
 * (e.g. the event target is outside the element).
 */
function isInteractOutsideEvent(event: any, element: Element | undefined) {
  if (event.button > 0) {
    return false;
  }

  // if the event target is no longer in the document
  if (event.target) {
    const ownerDocument = getDocument(event.target);

    if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) {
      return false;
    }
  }

  return !element?.contains(event.target);
}

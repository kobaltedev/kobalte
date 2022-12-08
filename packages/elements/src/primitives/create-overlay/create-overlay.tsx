/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlay.ts
 */

import { access, EventKey, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, JSX, onCleanup } from "solid-js";

import { createInteractOutside, createPreventScroll } from "../index";
import { ariaHideOutside } from "./aria-hide-outside";

export interface CreateOverlayProps {
  /** Whether the overlay is currently open. */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /** Handler that is called when the overlay should close. */
  onClose?: () => void;

  /**
   * Whether the overlay should block interaction with outside elements,
   * and be the only visible content for screen readers.
   */
  isModal?: MaybeAccessor<boolean | undefined>;

  /** Whether the scroll should be locked when the overlay is open. */
  preventScroll?: MaybeAccessor<boolean | undefined>;

  /** Whether to close the overlay when the user interacts outside it. */
  closeOnInteractOutside?: MaybeAccessor<boolean | undefined>;

  /** Whether pressing the escape key should close the overlay. */
  closeOnEsc?: MaybeAccessor<boolean | undefined>;

  /**
   * When user interacts with the argument element outside the overlay ref,
   * return true if onClose should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the overlay.
   * By default, onClose will always be called on interaction outside the overlay ref.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
}

const visibleOverlays: Array<Element> = [];

/**
 * Provides the behavior for overlays such as dialogs, popovers, and menus.
 * Hides the overlay when the user interacts outside it or when the Escape key is pressed.
 * Only the top-most overlay will close at once.
 */
export function createOverlay<T extends HTMLElement>(
  props: CreateOverlayProps,
  ref: Accessor<T | undefined>
) {
  const isTopMostOverlay = () => {
    return visibleOverlays[visibleOverlays.length - 1] === ref();
  };

  // Only hide the overlay when it is the topmost visible overlay in the stack.
  const onHide = () => {
    if (isTopMostOverlay()) {
      props.onClose?.();
    }
  };

  const shouldCloseOnInteractOutside = (element: Element) => {
    return (
      !access(props.shouldCloseOnInteractOutside) ||
      access(props.shouldCloseOnInteractOutside)?.(element)
    );
  };

  const onInteractOutsideStart = (e: Event) => {
    if (shouldCloseOnInteractOutside(e.target as Element) && isTopMostOverlay()) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const onInteractOutside = (e: Event) => {
    if (shouldCloseOnInteractOutside(e.target as Element)) {
      if (isTopMostOverlay()) {
        e.stopPropagation();
        e.preventDefault();
      }

      onHide();
    }
  };

  // Handle the escape key
  const onEscapeKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    if (e.key === EventKey.Escape && access(props.closeOnEsc)) {
      e.stopPropagation();
      e.preventDefault();
      onHide();
    }
  };

  // Handle clicking outside the overlay to close it
  createInteractOutside(
    {
      isDisabled: () => !access(props.closeOnInteractOutside),
      onInteractOutsideStart,
      onInteractOutside,
    },
    ref
  );

  // Handle prevent scroll when the overlay is open
  createPreventScroll({
    isDisabled: () =>
      !((access(props.preventScroll) ?? access(props.isModal)) && access(props.isOpen)),
  });

  // Hides all elements in the DOM outside the given targets from screen readers when the overlay is an opened modal
  createEffect(() => {
    const refEl = ref();

    if (!refEl) {
      return;
    }

    if (access(props.isModal) && access(props.isOpen)) {
      const cleanup = ariaHideOutside([refEl]);

      onCleanup(cleanup);
    }
  });

  // Add the overlay ref to the stack of visible overlays on mount, and remove on unmount.
  createEffect(() => {
    const refEl = ref();

    if (refEl && access(props.isOpen)) {
      visibleOverlays.push(refEl);
    }

    onCleanup(() => {
      if (!refEl) {
        return;
      }

      const index = visibleOverlays.indexOf(refEl);

      if (index >= 0) {
        visibleOverlays.splice(index, 1);
      }
    });
  });

  return {
    overlayProps: { onEscapeKeyDown },
  };
}

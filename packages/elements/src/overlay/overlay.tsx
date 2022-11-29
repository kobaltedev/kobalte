/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlay.ts
 */

import {
  callHandler,
  createPolymorphicComponent,
  EventKey,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { FocusTrapRegion, FocusTrapRegionProps } from "../focus-trap";
import { createInteractOutside, createPreventScroll } from "../primitives";
import { ariaHideOutside } from "./aria-hide-outside";

export interface OverlayProps extends FocusTrapRegionProps {
  /** Whether the overlay is currently open. */
  isOpen?: boolean;

  /** Handler that is called when the overlay should close. */
  onClose?: () => void;

  /**
   * Whether the overlay should block interaction with outside elements,
   * and be the only visible content for screen readers.
   */
  isModal?: boolean;

  /** Whether the scroll should be locked when the overlay is open. */
  preventScroll?: boolean;

  /** Whether to close the overlay when the user interacts outside it. */
  closeOnInteractOutside?: boolean;

  /** Whether pressing the escape key should close the overlay. */
  closeOnEsc?: boolean;

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
export const Overlay = createPolymorphicComponent<"div", OverlayProps>(props => {
  let ref: HTMLDivElement | undefined;

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "ref",
    "isOpen",
    "onClose",
    "isModal",
    "preventScroll",
    "closeOnInteractOutside",
    "closeOnEsc",
    "shouldCloseOnInteractOutside",
    "trapFocus",
    "onKeyDown",
  ]);

  const isTopMostOverlay = () => {
    return visibleOverlays[visibleOverlays.length - 1] === ref;
  };

  // Only hide the overlay when it is the topmost visible overlay in the stack.
  const onHide = () => {
    if (isTopMostOverlay()) {
      local.onClose?.();
    }
  };

  const shouldCloseOnInteractOutside = (element: Element) => {
    return !local.shouldCloseOnInteractOutside || local.shouldCloseOnInteractOutside(element);
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
  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (e.key === EventKey.Escape && local.closeOnEsc) {
      e.stopPropagation();
      e.preventDefault();
      onHide();
    }
  };

  // Handle clicking outside the overlay to close it
  createInteractOutside(
    {
      isDisabled: () => !local.closeOnInteractOutside,
      onInteractOutsideStart,
      onInteractOutside,
    },
    () => ref
  );

  // Handle prevent scroll when the overlay is open
  createPreventScroll({
    isDisabled: () => !((local.preventScroll ?? local.isModal) && local.isOpen),
  });

  // Hides all elements in the DOM outside the given targets from screen readers when the overlay is an opened modal
  createEffect(() => {
    if (!ref) {
      return;
    }

    if (local.isModal && local.isOpen) {
      const cleanup = ariaHideOutside([ref]);

      onCleanup(cleanup);
    }
  });

  // Add the overlay ref to the stack of visible overlays on mount, and remove on unmount.
  createEffect(() => {
    if (ref && local.isOpen) {
      visibleOverlays.push(ref);
    }

    onCleanup(() => {
      if (!ref) {
        return;
      }

      const index = visibleOverlays.indexOf(ref);

      if (index >= 0) {
        visibleOverlays.splice(index, 1);
      }
    });
  });

  return (
    <FocusTrapRegion
      ref={mergeRefs(el => (ref = el), local.ref)}
      trapFocus={(local.trapFocus ?? local.isModal) && local.isOpen}
      onKeyDown={onKeyDown}
      {...others}
    />
  );
});

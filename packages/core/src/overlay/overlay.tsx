/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlay.ts
 *
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 */

import {
  composeEventHandlers,
  contains,
  createPolymorphicComponent,
  getDocument,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createSignal, JSX, on, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createEscapeKeyDown, createInteractOutside, createPreventScroll } from "../primitives";
import { ariaHideOutside } from "./aria-hide-outside";
import { OverlayContext, OverlayContextValue, useOptionalOverlayContext } from "./overlay-context";

export interface OverlayProps {
  /** Whether the overlay is currently open. */
  isOpen?: boolean;

  /**
   * Whether the overlay should be the only visible content for screen readers.
   * If `true`, when the overlay is open:
   * - Every element outside the overlay will be hidden for screen readers.
   * - Scroll will be locked.
   * - Hover/focus/click interactions will be disabled on elements outside
   *   the overlay. Users will need to click twice on outside elements to
   *   interact with them: once to close the overlay, and again to trigger the element.
   */
  isModal?: boolean;

  /** Whether pressing the escape key should close the overlay. */
  closeOnEsc?: boolean;

  /** Whether to close the overlay when the user interacts outside it. */
  closeOnInteractOutside?: boolean;

  /**
   * When user interacts with the argument element outside the overlay,
   * return true if `onClose` should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the overlay.
   * By default, `onClose` will always be called on interaction outside the overlay.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;

  /** Handler that is called when the overlay should close. */
  onClose?: () => void;

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

let originalBodyPointerEvents: string;

const [visibleOverlays, setVisibleOverlays] = createSignal<HTMLElement[]>([]);
const [visibleModalOverlays, setVisibleModalOverlays] = createSignal<HTMLElement[]>([]);

/**
 * A dismissable layer such as dialogs, popovers, and menus.
 * Hides when the user interacts outside it, the Escape key is pressed, or optionally, on blur.
 * Supports modal and non-modal mode.
 */
export const Overlay = createPolymorphicComponent<"div", OverlayProps>(props => {
  let ref: HTMLElement | undefined;

  const nestedOverlays = new Set<Element>([]);

  const parentContext = useOptionalOverlayContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "style",
    "isOpen",
    "isModal",
    "closeOnEsc",
    "closeOnInteractOutside",
    "shouldCloseOnInteractOutside",
    "onClose",
    "onFocusOut",
  ]);

  const isBodyPointerEventsDisabled = () => visibleModalOverlays().length > 0;

  const isPointerEventsEnabled = () => {
    const modalOverlays = visibleModalOverlays();
    const topMostModalLayer = modalOverlays[modalOverlays.length - 1];
    const currentIndex = ref ? visibleOverlays().indexOf(ref) : -1;

    return currentIndex >= visibleOverlays().indexOf(topMostModalLayer);
  };

  const isElementInOverlayTree = (element: Element) => {
    return [ref, ...nestedOverlays].some(overlay => contains(overlay, element));
  };

  const isTopMostOverlay = () => {
    const overlays = visibleOverlays();
    return overlays[overlays.length - 1] === ref;
  };

  const registerNestedOverlay = (element: Element) => {
    nestedOverlays.add(element);

    const parentUnregister = parentContext?.registerNestedOverlay(element);

    return () => {
      nestedOverlays.delete(element);
      parentUnregister?.();
    };
  };

  const shouldCloseOnInteractWith = (element: Element) => {
    // Do not close if element is in a nested overlay (e.g. menu inside a dialog).
    if (isElementInOverlayTree(element)) {
      return false;
    }

    if (local.shouldCloseOnInteractOutside == null) {
      return true;
    }

    return local.shouldCloseOnInteractOutside(element);
  };

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (!relatedTarget || !shouldCloseOnInteractWith(relatedTarget)) {
      return;
    }

    if (local.isOpen && local.closeOnInteractOutside) {
      local.onClose?.();
    }
  };

  createInteractOutside(
    {
      isDisabled: () => !(local.isOpen && local.closeOnInteractOutside),
      // Listens for `start` interaction outside to mimic overlay dismissing behaviour present in OS.
      onInteractOutsideStart: e => {
        const target = e.target as HTMLElement | null;

        if (!target || !isPointerEventsEnabled() || !shouldCloseOnInteractWith(target)) {
          return;
        }

        local.onClose?.();
      },
    },
    () => ref
  );

  createEscapeKeyDown({
    isDisabled: () => !(local.isOpen && local.closeOnEsc),
    ownerDocument: () => getDocument(ref),
    onEscapeKeyDown: e => {
      if (!isTopMostOverlay()) {
        return;
      }

      e.preventDefault();
      local.onClose?.();
    },
  });

  createPreventScroll({
    isDisabled: () => !(local.isOpen && local.isModal),
  });

  // Hides all elements in the DOM outside the given targets from screen readers.
  createEffect(() => {
    if (ref && local.isOpen && local.isModal) {
      onCleanup(ariaHideOutside([ref]));
    }
  });

  // Register to parent overlay if any.
  createEffect(() => {
    if (ref && local.isOpen && parentContext) {
      onCleanup(parentContext.registerNestedOverlay(ref));
    }
  });

  // Add to visible overlays and disabled pointer-events if needed.
  createEffect(
    on([() => ref, () => local.isOpen, () => local.isModal], ([ref, isOpen, isModal]) => {
      if (!ref) {
        return;
      }

      const ownerDocument = getDocument(ref);

      if (isOpen) {
        setVisibleOverlays(prev => [...prev, ref]);

        if (isModal) {
          const visibleModalOverlays = setVisibleModalOverlays(prev => [...prev, ref]);

          // The first modal in the stack disable pointer-events on body.
          if (visibleModalOverlays.length === 1) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
        }
      }

      onCleanup(() => {
        setVisibleOverlays(prev => prev.filter(overlay => overlay !== ref));

        const visibleModalOverlays = setVisibleModalOverlays(prev =>
          prev.filter(overlay => overlay !== ref)
        );

        // Restore original body pointer-events when there is no modal in the stack.
        if (visibleModalOverlays.length === 0) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;

          if (ownerDocument.body.style.length === 0) {
            ownerDocument.body.removeAttribute("style");
          }
        }
      });
    })
  );

  const context: OverlayContextValue = {
    registerNestedOverlay: registerNestedOverlay,
  };

  return (
    <OverlayContext.Provider value={context}>
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        style={{
          "pointer-events": isBodyPointerEventsDisabled()
            ? isPointerEventsEnabled()
              ? "auto"
              : "none"
            : undefined,
          ...local.style,
        }}
        onFocusOut={composeEventHandlers([local.onFocusOut, onFocusOut])}
        {...others}
      />
    </OverlayContext.Provider>
  );
});

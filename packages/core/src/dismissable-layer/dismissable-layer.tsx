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
  combineProps,
  contains,
  createPolymorphicComponent,
  getDocument,
  mergeDefaultProps,
} from "@kobalte/utils";
import { createEffect, createSignal, JSX, on, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createEscapeKeyDown, createInteractOutside, createPreventScroll } from "../primitives";
import { ariaHideOutside } from "./aria-hide-outside";
import {
  DismissableLayerContext,
  DismissableLayerContextValue,
  useOptionalDismissableLayerContext,
} from "./dismissable-layer-context";

export interface DismissableLayerProps {
  /** Whether the `DismissableLayer` is currently open. */
  isOpen?: boolean;

  /**
   * Whether the `DismissableLayer` should be the only visible content for screen readers.
   * If `true`, when the `DismissableLayer` is open:
   * - Every element outside the `DismissableLayer` will be hidden for screen readers.
   * - Scroll will be locked.
   * - Hover/focus/click interactions will be disabled on elements outside
   *   the `DismissableLayer`. Users will need to click twice on outside elements to
   *   interact with them: once to close the `DismissableLayer`, and again to trigger the element.
   */
  isModal?: boolean;

  /** Whether pressing the escape key should close the `DismissableLayer`. */
  closeOnEsc?: boolean;

  /** Whether to close the `DismissableLayer` when the user interacts outside it. */
  closeOnInteractOutside?: boolean;

  /**
   * When user interacts with the argument element outside the `DismissableLayer`,
   * return true if `onClose` should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the _layer_.
   * By default, `onClose` will always be called on interaction outside the `DismissableLayer`.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;

  /** Handler that is called when the overlay should close. */
  onClose?: () => void;
}

let originalBodyPointerEvents: string;

const [visibleLayers, setVisibleLayers] = createSignal<HTMLElement[]>([]);
const [visibleModalLayers, setVisibleModalLayers] = createSignal<HTMLElement[]>([]);

export const DismissableLayer = createPolymorphicComponent<"div", DismissableLayerProps>(props => {
  let ref: HTMLDivElement | undefined;

  const parentContext = useOptionalDismissableLayerContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "isOpen",
    "isModal",
    "closeOnEsc",
    "closeOnInteractOutside",
    "shouldCloseOnInteractOutside",
    "onClose",
  ]);

  const nestedLayers = new Set<Element>([]);

  const isBodyPointerEventsDisabled = () => visibleModalLayers().length > 0;

  const isPointerEventsEnabled = () => {
    const modalLayers = visibleModalLayers();
    const topMostModalLayer = modalLayers[modalLayers.length - 1];
    const currentIndex = ref ? visibleLayers().indexOf(ref) : -1;

    return currentIndex >= visibleLayers().indexOf(topMostModalLayer);
  };

  const isElementInLayerTree = (element: Node) => {
    return [ref, ...nestedLayers].some(layer => contains(layer, element));
  };

  const isTopMostLayer = () => {
    const layers = visibleLayers();
    return layers[layers.length - 1] === ref;
  };

  const registerNestedDismissableLayer = (element: Element) => {
    nestedLayers.add(element);

    const parentUnregister = parentContext?.registerNestedDismissableLayer(element);

    return () => {
      nestedLayers.delete(element);
      parentUnregister?.();
    };
  };

  const shouldCloseOnInteractWith = (element: Element) => {
    // Do not close if element is in a nested layer (e.g. menu inside a dialog).
    if (isElementInLayerTree(element)) {
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
      // Listens for `start` interaction outside to mimic layer dismissing behaviour present in OS.
      onInteractOutsideStart: e => {
        if (local.isModal && !isTopMostLayer()) {
          return;
        }

        const target = e.target as HTMLElement | null;

        if (!target || !shouldCloseOnInteractWith(target)) {
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
      if (!isTopMostLayer()) {
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
    if (!ref) {
      return;
    }

    if (local.isOpen && local.isModal) {
      const cleanup = ariaHideOutside([ref]);

      onCleanup(cleanup);
    }
  });

  // Register to parent layer if any.
  createEffect(() => {
    if (!local.isOpen) {
      return;
    }

    if (!ref || !parentContext) {
      return;
    }

    const unregister = parentContext.registerNestedDismissableLayer(ref);

    onCleanup(unregister);
  });

  // Add to visible layers and disabled pointer events if needed.
  createEffect(
    on([() => ref, () => local.isOpen, () => local.isModal], ([ref, isOpen, isModal]) => {
      if (!ref) {
        return;
      }

      const ownerDocument = getDocument(ref);

      if (isOpen) {
        setVisibleLayers(prev => [...prev, ref]);

        if (isModal) {
          const visibleModalLayers = setVisibleModalLayers(prev => [...prev, ref]);

          // The first modal in the layer stack disable pointer-events on body.
          if (visibleModalLayers.length === 1) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
        }
      }

      onCleanup(() => {
        setVisibleLayers(prev => prev.filter(layer => layer !== ref));

        const visibleModalLayers = setVisibleModalLayers(prev =>
          prev.filter(layer => layer !== ref)
        );

        // Restore original body pointer-events when there is no modal in the layer stack.
        if (visibleModalLayers.length === 0) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      });
    })
  );

  const context: DismissableLayerContextValue = {
    registerNestedDismissableLayer,
  };

  return (
    <DismissableLayerContext.Provider value={context}>
      <Dynamic
        component={local.as}
        {...combineProps(
          {
            ref: el => (ref = el),
          },
          others,
          {
            style: {
              "pointer-events": isBodyPointerEventsDisabled()
                ? isPointerEventsEnabled()
                  ? "auto"
                  : "none"
                : undefined,
            },
            onFocusOut,
          }
        )}
      />
    </DismissableLayerContext.Provider>
  );
});

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

import { access, contains, getDocument, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, createSignal, JSX, on, onCleanup } from "solid-js";

import { createEscapeKeyDown } from "../create-escape-key-down";
import { createInteractOutside } from "../create-interact-outside";
import { createPreventScroll } from "../create-prevent-scroll";
import { ariaHideOutside } from "./aria-hide-outside";
import {
  DismissableLayerContextValue,
  useOptionalDismissableLayerContext,
} from "./dismissable-layer-context";

export interface CreateDismissableLayerProps {
  /** Whether the _dismissable layer_ is currently open. */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the _dismissable layer_ should be the only visible content for screen readers.
   * If `true`, when the _dismissable layer_ is open:
   * - Every element outside the _dismissable layer_ will be hidden for screen readers.
   * - Scroll will be locked.
   * - Hover/focus/click interactions will be disabled on elements outside
   *   the _dismissable layer_. Users will need to click twice on outside elements to
   *   interact with them: once to close the _dismissable layer_, and again to trigger the element.
   */
  isModal?: MaybeAccessor<boolean | undefined>;

  /** Whether pressing the escape key should close the _dismissable layer_. */
  closeOnEsc?: MaybeAccessor<boolean | undefined>;

  /** Whether to close the _dismissable layer_ when the user interacts outside it. */
  closeOnInteractOutside?: MaybeAccessor<boolean | undefined>;

  /**
   * When user interacts with the argument element outside the _dismissable layer_,
   * return true if `onClose` should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the _layer_.
   * By default, `onClose` will always be called on interaction outside the _dismissable layer_.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;

  /** Handler that is called when the overlay should close. */
  onClose?: () => void;
}

let originalBodyPointerEvents: string;

const [visibleLayers, setVisibleLayers] = createSignal<HTMLElement[]>([]);
const [visibleModalLayers, setVisibleModalLayers] = createSignal<HTMLElement[]>([]);

/**
 * Provides the behavior for dismissable layers such as dialogs, popovers, and menus.
 * Hides the layer when the user interacts outside, focus outside or when the Escape key is pressed.
 * Support nested layers, modal and non-modal mode.
 */
export function createDismissableLayer<T extends HTMLElement>(
  props: CreateDismissableLayerProps,
  ref: Accessor<T | undefined>
) {
  const parentContext = useOptionalDismissableLayerContext();

  const nestedLayers = new Set<Element>([]);

  //const [index, setIndex] = createSignal(-1);

  const ownerDocument = createMemo(() => getDocument(ref()));

  const isPointerEventsEnabled = createMemo(() => {
    const modalLayers = visibleModalLayers();
    const topMostModalLayer = modalLayers[modalLayers.length - 1];

    const refEl = ref();

    const currentIndex = refEl ? visibleLayers().indexOf(refEl) : -1;

    return currentIndex >= visibleLayers().indexOf(topMostModalLayer);
  });

  const style = createMemo(() => {
    const isBodyPointerEventsDisabled = visibleModalLayers().length > 0;

    return {
      "pointer-events": isBodyPointerEventsDisabled
        ? isPointerEventsEnabled()
          ? "auto"
          : "none"
        : undefined,
    } as JSX.CSSProperties;
  });

  const isElementInLayerTree = (element: Node) => {
    return [ref(), ...nestedLayers].some(layer => contains(layer, element));
  };

  const registerNestedDismissableLayer = (element: Element) => {
    nestedLayers.add(element);

    const parentUnregister = parentContext?.registerNestedDismissableLayer(element);

    return () => {
      nestedLayers.delete(element);
      parentUnregister?.();
    };
  };

  const isTopMostLayer = () => {
    const layers = visibleLayers();
    return layers[layers.length - 1] === ref();
  };

  const shouldCloseOnInteractWith = (element: Element) => {
    // Do not close if element is in a nested layer (e.g. menu inside a dialog).
    if (isElementInLayerTree(element)) {
      return false;
    }

    const shouldCloseOnInteractOutside = access(props.shouldCloseOnInteractOutside);

    if (shouldCloseOnInteractOutside == null) {
      return true;
    }

    return shouldCloseOnInteractOutside(element);
  };

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (!relatedTarget || !shouldCloseOnInteractWith(relatedTarget)) {
      return;
    }

    if (access(props.isOpen) && access(props.closeOnInteractOutside)) {
      props.onClose?.();
    }
  };

  createInteractOutside(
    {
      isDisabled: () => !(access(props.isOpen) && access(props.closeOnInteractOutside)),
      // Listens for `start` interaction outside to mimic layer dismissing behaviour present in OS.
      onInteractOutsideStart: e => {
        if (access(props.isModal) && !isTopMostLayer()) {
          return;
        }

        const target = e.target as HTMLElement | null;

        if (!target || !shouldCloseOnInteractWith(target)) {
          return;
        }

        props.onClose?.();
      },
    },
    ref
  );

  createEscapeKeyDown({
    isDisabled: () => !(access(props.isOpen) && access(props.closeOnEsc)),
    ownerDocument,
    onEscapeKeyDown: e => {
      if (!isTopMostLayer()) {
        return;
      }

      e.preventDefault();
      props.onClose?.();
    },
  });

  createPreventScroll({
    isDisabled: () => !(access(props.isOpen) && access(props.isModal)),
  });

  // Hides all elements in the DOM outside the given targets from screen readers.
  createEffect(() => {
    const refEl = ref();

    if (!refEl) {
      return;
    }

    if (access(props.isOpen) && access(props.isModal)) {
      const cleanup = ariaHideOutside([refEl]);

      onCleanup(cleanup);
    }
  });

  // Register to parent layer if any.
  createEffect(() => {
    if (!access(props.isOpen)) {
      return;
    }

    const refEl = ref();

    if (!refEl || !parentContext) {
      return;
    }

    const unregister = parentContext.registerNestedDismissableLayer(refEl);

    onCleanup(unregister);
  });

  // Add to visible layers and disabled pointer events if needed.
  createEffect(
    on(
      [ref, ownerDocument, () => access(props.isOpen), () => access(props.isModal)],
      ([ref, ownerDocument, isOpen, isModal]) => {
        if (!ref) {
          return;
        }

        if (isOpen) {
          const visibleLayers = setVisibleLayers(prev => [...prev, ref]);

          //setIndex(visibleLayers.indexOf(ref));

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
          //setIndex(-1);

          const visibleModalLayers = setVisibleModalLayers(prev =>
            prev.filter(layer => layer !== ref)
          );

          // Restore original body pointer-events when there is no modal in the layer stack.
          if (visibleModalLayers.length === 0) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        });
      }
    )
  );

  const context: DismissableLayerContextValue = {
    registerNestedDismissableLayer,
  };

  return {
    context,
    style,
    onFocusOut,
  };
}

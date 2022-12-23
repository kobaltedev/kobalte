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
import {
  Accessor,
  createComponent,
  createEffect,
  createMemo,
  createSignal,
  FlowComponent,
  JSX,
  on,
  onCleanup,
} from "solid-js";

import { createEscapeKeyDown } from "../create-escape-key-down";
import { createInteractOutside } from "../create-interact-outside";
import { createPreventScroll } from "../create-prevent-scroll";
import { ariaHideOutside } from "./aria-hide-outside";
import {
  DismissableLayerContext,
  DismissableLayerContextValue,
  useOptionalDismissableLayerContext,
} from "./dismissable-layer-context";

export interface CreateOverlayProps {
  /** Whether the overlay is currently open. */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the overlay should be the only visible content for screen readers.
   * If its `true`, when the overlay is open:
   * - every element outside the overlay will be hidden for screen readers.
   * - scroll will be locked.
   * - hover/focus/click interactions will be disabled on elements outside
   *   the overlay. Users will need to click twice on outside elements to
   *   interact with them: once to close the overlay, and again to trigger the element.
   */
  isModal?: MaybeAccessor<boolean | undefined>;

  /** Whether pressing the escape key should close the overlay. */
  closeOnEsc?: MaybeAccessor<boolean | undefined>;

  /** Whether to close the overlay when the user interacts outside it. */
  closeOnInteractOutside?: MaybeAccessor<boolean | undefined>;

  /**
   * When user interacts with the argument element outside the overlay ref,
   * return true if onClose should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the overlay.
   * By default, onClose will always be called on interaction outside the overlay ref.
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
export function createOverlay<T extends HTMLElement>(
  props: CreateOverlayProps,
  ref: Accessor<T | undefined>
) {
  const parentContext = useOptionalDismissableLayerContext();

  const nestedLayers = new Set<HTMLElement>([]);

  const [index, setIndex] = createSignal(-1);

  const ownerDocument = createMemo(() => getDocument(ref()));

  const isPointerEventsEnabled = createMemo(() => {
    const modals = visibleModalLayers();
    const topMostVisibleModal = modals[modals.length - 1];

    return index() >= visibleLayers().indexOf(topMostVisibleModal);
  });

  const cssPointerEventsValue: Accessor<JSX.CSSProperties["pointer-events"]> = createMemo(() => {
    const isBodyPointerEventsDisabled = visibleModalLayers().length > 0;

    if (isBodyPointerEventsDisabled) {
      return isPointerEventsEnabled() ? "auto" : "none";
    }

    return undefined;
  });

  const isElementInDismissableLayerTree = (element: Node) => {
    return [ref(), ...nestedLayers].some(layer => contains(layer, element));
  };

  const registerNestedDismissableLayer = (element: HTMLElement) => {
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
    const shouldCloseOnInteractOutside = access(props.shouldCloseOnInteractOutside);

    if (shouldCloseOnInteractOutside == null) {
      return true;
    }

    return shouldCloseOnInteractOutside(element);
  };

  // Handle hide the overlay when the user focus outside it.
  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (relatedTarget == null) {
      return;
    }

    // If focus is moving into a nested overlay (e.g. menu inside a dialog)
    // or an element that should not close the overlay (e.g. a popover trigger),
    // do not close the outer overlay.
    if (
      isElementInDismissableLayerTree(relatedTarget) ||
      !shouldCloseOnInteractWith(relatedTarget)
    ) {
      return;
    }

    if (access(props.isOpen) && access(props.closeOnInteractOutside)) {
      props.onClose?.();
    }
  };

  // Handle hide the overlay when the user interact outside it.
  createInteractOutside(
    {
      isDisabled: () => !(access(props.isOpen) && access(props.closeOnInteractOutside)),
      // Listens for `start` interaction outside to mimic layer dismissing behaviour present in OS.
      onInteractOutsideStart: e => {
        if (access(props.isModal) && !isTopMostLayer()) {
          return;
        }

        const target = e.target as HTMLElement | null;

        if (target == null) {
          return;
        }

        if (isElementInDismissableLayerTree(target) || !shouldCloseOnInteractWith(target)) {
          return;
        }

        props.onClose?.();
      },
    },
    ref
  );

  // Handle hide the overlay when the escape key is pressed.
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

  // Handle prevent scroll when the overlay is modal and opened.
  createPreventScroll({
    isDisabled: () => !(access(props.isOpen) && access(props.isModal)),
  });

  // Hides all elements in the DOM outside the given targets from screen readers when the overlay is modal an opened
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

  // Register as nested in the parent overlay.
  createEffect(() => {
    if (!access(props.isOpen)) {
      return;
    }

    const refEl = ref();

    if (!refEl || !parentContext) {
      return;
    }

    const unregister = parentContext.registerNestedDismissableLayer(refEl);

    onCleanup(() => {
      unregister();
    });
  });

  // Add layer to visible layers and disabled pointer events if needed.
  createEffect(
    on(
      [ref, ownerDocument, () => access(props.isOpen), () => access(props.isModal)],
      ([ref, ownerDocument, isOpen, isModal]) => {
        if (!ref) {
          return;
        }

        if (isOpen) {
          setVisibleLayers(prev => [...prev, ref]);

          setIndex(visibleLayers().indexOf(ref));

          if (isModal) {
            const visibleModalLayers = setVisibleModalLayers(prev => [...prev, ref]);

            if (visibleModalLayers.length === 1) {
              originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
              ownerDocument.body.style.pointerEvents = "none";
            }
          }
        }

        onCleanup(() => {
          setIndex(-1);
          setVisibleLayers(prev => prev.filter(el => el !== ref));
          const visibleModalLayers = setVisibleModalLayers(prev => prev.filter(el => el !== ref));

          if (visibleModalLayers.length === 0) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        });
      }
    )
  );

  const context: DismissableLayerContextValue = {
    isElementInDismissableLayerTree,
    registerNestedDismissableLayer,
  };

  const DismissableLayerProvider: FlowComponent = props => {
    return createComponent(DismissableLayerContext.Provider, {
      value: context,
      get children() {
        return props.children;
      },
    });
  };

  return {
    DismissableLayerProvider,
    dismissableLayerProps: { cssPointerEventsValue },
    dismissableLayerHandlers: { onFocusOut },
  };
}

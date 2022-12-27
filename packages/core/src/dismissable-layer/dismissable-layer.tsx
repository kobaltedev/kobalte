/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/dismissable-layer.ts
 */

import {
  contains,
  createPolymorphicComponent,
  getDocument,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { Accessor, createEffect, on, onCleanup, onMount, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createEscapeKeyDown,
  createInteractOutside,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import { layerStack } from "./layer-stack";

export interface DismissableLayerProps {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the layer. Users will need to click twice on outside elements to
   * interact with them: once to close the layer, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean;

  /** A list of elements that should not dismiss the layer when interacted with. */
  excludedElements?: Array<Accessor<HTMLElement | undefined>>;

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when a `pointerdown` event happens outside the layer.
   * Can be prevented.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /**
   * Event handler called when the focus moves outside the layer.
   * Can be prevented.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;

  /**
   * Event handler called when an interaction happens outside the layer.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;

  /** Handler called when the layer should be dismissed. */
  onDismiss?: () => void;
}

export const DismissableLayer = createPolymorphicComponent<"div", DismissableLayerProps>(props => {
  let ref: HTMLElement | undefined;

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "disableOutsidePointerEvents",
    "excludedElements",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "onDismiss",
  ]);

  const shouldExcludeElement = (element: Element) => {
    if (!ref) {
      return false;
    }

    return (
      props.excludedElements?.some(node => contains(node(), element)) ||
      layerStack.isInNestedLayer(ref, element)
    );
  };

  const onPointerDownOutside = (e: PointerDownOutsideEvent) => {
    if (!ref || layerStack.isBelowPointerBlockingLayer(ref)) {
      return;
    }

    props.onPointerDownOutside?.(e);
    props.onInteractOutside?.(e);

    if (!e.defaultPrevented) {
      props.onDismiss?.();
    }
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    props.onFocusOutside?.(e);
    props.onInteractOutside?.(e);

    if (!e.defaultPrevented) {
      props.onDismiss?.();
    }
  };

  createInteractOutside(
    {
      shouldExcludeElement,
      onPointerDownOutside,
      onFocusOutside,
    },
    () => ref
  );

  createEscapeKeyDown({
    ownerDocument: () => getDocument(ref),
    onEscapeKeyDown: e => {
      if (!ref || !layerStack.isTopMostLayer(ref)) {
        return;
      }

      props.onEscapeKeyDown?.(e);

      if (!e.defaultPrevented && props.onDismiss) {
        e.preventDefault();
        props.onDismiss();
      }
    },
  });

  onMount(() => {
    if (!ref) {
      return;
    }

    layerStack.addLayer({
      node: ref,
      isPointerBlocking: props.disableOutsidePointerEvents,
      dismiss: props.onDismiss,
    });

    layerStack.assignPointerEventToLayers();

    layerStack.disableBodyPointerEvents(ref);
  });

  onCleanup(() => {
    if (!ref) {
      return;
    }

    layerStack.removeLayer(ref);

    // Re-assign pointer event to remaining layers.
    layerStack.assignPointerEventToLayers();

    layerStack.restoreBodyPointerEvents(ref);
  });

  createEffect(
    on(
      [() => ref, () => props.disableOutsidePointerEvents],
      ([ref, disableOutsidePointerEvents]) => {
        if (!ref) {
          return;
        }

        const layer = layerStack.find(ref);

        if (layer && layer.isPointerBlocking !== disableOutsidePointerEvents) {
          // Keep layer in sync with the prop.
          layer.isPointerBlocking = disableOutsidePointerEvents;

          // Update layers pointer-events since this layer "isPointerBlocking" has changed.
          layerStack.assignPointerEventToLayers();
        }

        if (disableOutsidePointerEvents) {
          layerStack.disableBodyPointerEvents(ref);
        }

        onCleanup(() => {
          layerStack.restoreBodyPointerEvents(ref);
        });
      },
      {
        defer: true,
      }
    )
  );

  return <Dynamic component={local.as} ref={mergeRefs(el => (ref = el), local.ref)} {...others} />;
});

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

import { contains, getDocument, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, createEffect, on, onCleanup, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import {
  createEscapeKeyDown,
  createInteractOutside,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import {
  DismissableLayerContext,
  DismissableLayerContextValue,
  useOptionalDismissableLayerContext,
} from "./dismissable-layer-context";
import { layerStack } from "./layer-stack";

export interface DismissableLayerOptions {
  /** Whether the layer is dismissed or not. */
  isDismissed: boolean;

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

export function DismissableLayer(props: OverrideComponentProps<"div", DismissableLayerOptions>) {
  let ref: HTMLElement | undefined;

  const parentContext = useOptionalDismissableLayerContext();

  const [local, others] = splitProps(props, [
    "ref",
    "isDismissed",
    "disableOutsidePointerEvents",
    "excludedElements",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "onDismiss",
  ]);

  const nestedLayers = new Set<Element>([]);

  const registerNestedLayer = (element: Element) => {
    nestedLayers.add(element);

    const parentUnregister = parentContext?.registerNestedLayer(element);

    return () => {
      nestedLayers.delete(element);
      parentUnregister?.();
    };
  };

  const shouldExcludeElement = (element: Element) => {
    if (!ref) {
      return false;
    }

    return (
      local.excludedElements?.some(node => contains(node(), element)) ||
      [...nestedLayers].some(layer => contains(layer, element))
    );
  };

  const onPointerDownOutside = (e: PointerDownOutsideEvent) => {
    if (!ref || layerStack.isBelowPointerBlockingLayer(ref)) {
      return;
    }

    local.onPointerDownOutside?.(e);
    local.onInteractOutside?.(e);

    if (!e.defaultPrevented) {
      local.onDismiss?.();
    }
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);
    local.onInteractOutside?.(e);

    if (!e.defaultPrevented) {
      local.onDismiss?.();
    }
  };

  createInteractOutside(
    {
      isDisabled: () => local.isDismissed,
      shouldExcludeElement,
      onPointerDownOutside,
      onFocusOutside,
    },
    () => ref
  );

  createEscapeKeyDown({
    isDisabled: () => local.isDismissed,
    ownerDocument: () => getDocument(ref),
    onEscapeKeyDown: e => {
      if (!ref || !layerStack.isTopMostLayer(ref)) {
        return;
      }

      local.onEscapeKeyDown?.(e);

      if (!e.defaultPrevented && local.onDismiss) {
        e.preventDefault();
        local.onDismiss();
      }
    },
  });

  createEffect(
    on([() => ref, () => local.isDismissed], ([ref, isDismissed]) => {
      if (!ref || isDismissed) {
        return;
      }

      layerStack.addLayer({
        node: ref,
        isPointerBlocking: local.disableOutsidePointerEvents,
        dismiss: local.onDismiss,
      });

      const unregisterFromParentLayer = parentContext?.registerNestedLayer(ref);

      layerStack.assignPointerEventToLayers();

      layerStack.disableBodyPointerEvents(ref);

      onCleanup(() => {
        if (!ref) {
          return;
        }

        layerStack.removeLayer(ref);

        unregisterFromParentLayer?.();

        // Re-assign pointer event to remaining layers.
        layerStack.assignPointerEventToLayers();

        layerStack.restoreBodyPointerEvents(ref);
      });
    })
  );

  createEffect(
    on(
      [() => ref, () => local.isDismissed, () => local.disableOutsidePointerEvents],
      ([ref, isDismissed, disableOutsidePointerEvents]) => {
        if (!ref || isDismissed) {
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

  const context: DismissableLayerContextValue = {
    registerNestedLayer,
  };

  return (
    <DismissableLayerContext.Provider value={context}>
      <Polymorphic fallback="div" ref={mergeRefs(el => (ref = el), local.ref)} {...others} />
    </DismissableLayerContext.Provider>
  );
}

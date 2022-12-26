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
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/layer-stack.ts
 */

import { contains, getDocument, removeItemFromArray } from "@kobalte/utils";
import { createMemo, createSignal } from "solid-js";

export interface LayerModel {
  node: HTMLElement;
  isPointerBlocking?: boolean;
  dismiss?: VoidFunction;
}

let originalBodyPointerEvents: string;

const [layers, setLayers] = createSignal<LayerModel[]>([]);
const [branches, setBranches] = createSignal<HTMLElement[]>([]);

const pointerBlockingLayers = createMemo(() => {
  return layers().filter(layer => layer.isPointerBlocking);
});

const topMostPointerBlockingLayer = createMemo(() => {
  return [...pointerBlockingLayers()].slice(-1)[0] as LayerModel | undefined;
});

function indexOfLayer(node: HTMLElement | undefined) {
  return layers().findIndex(layer => layer.node === node);
}

function hasPointerBlockingLayer() {
  return pointerBlockingLayers().length > 0;
}

function isBelowPointerBlockingLayer(node: HTMLElement) {
  const highestBlockingIndex = indexOfLayer(topMostPointerBlockingLayer()?.node);
  return indexOfLayer(node) < highestBlockingIndex;
}

function isTopMostLayer(node: HTMLElement | null) {
  const items = layers();
  return items[items.length - 1].node === node;
}

function getNestedLayers(node: HTMLElement) {
  return Array.from(layers()).slice(indexOfLayer(node) + 1);
}

function isInNestedLayer(node: HTMLElement, target: Node | null) {
  return getNestedLayers(node).some(layer => contains(layer.node, target));
}

function addLayer(layer: LayerModel) {
  setLayers(prev => [...prev, layer]);
}

function removeLayer(node: HTMLElement) {
  const index = indexOfLayer(node);

  if (index < 0) {
    return;
  }

  // dismiss nested layers
  if (index < layers().length - 1) {
    const nestedLayers = getNestedLayers(node);
    nestedLayers.forEach(layer => layer.dismiss?.());
  }

  // remove this layer
  setLayers(prev => removeItemFromArray(prev, prev[index]));
}

function dismissLayer(node: HTMLElement) {
  layers()[indexOfLayer(node)]?.dismiss?.();
}

function isInBranch(target: Node | null) {
  return Array.from(branches()).some(branch => contains(branch, target));
}

function addBranch(node: HTMLElement) {
  setBranches(prev => [...prev, node]);
}

function removeBranch(node: HTMLElement) {
  const index = branches().indexOf(node);

  if (index >= 0) {
    setBranches(prev => removeItemFromArray(prev, prev[index]));
  }
}

function clearLayerStack() {
  const firstLayerNode = layers()[0]?.node;

  if (firstLayerNode) {
    removeLayer(firstLayerNode);
  }
}

function updateLayersPointerEvent() {
  layers().forEach(({ node }) => {
    node.style.pointerEvents = isBelowPointerBlockingLayer(node) ? "none" : "auto";
  });
}

function disablePointerEventsOutside(node: HTMLElement) {
  const ownerDocument = getDocument(node);

  if (hasPointerBlockingLayer()) {
    originalBodyPointerEvents = document.body.style.pointerEvents;
    ownerDocument.body.style.pointerEvents = "none";
  }

  return () => {
    if (hasPointerBlockingLayer()) {
      return;
    }

    ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;

    if (ownerDocument.body.style.length === 0) {
      ownerDocument.body.removeAttribute("style");
    }
  };
}

function clearPointerEvent(node: HTMLElement) {
  node.style.pointerEvents = "";
}

export const layerStack = {
  layers,
  addLayer,
  removeLayer,
  isTopMostLayer,
  isBelowPointerBlockingLayer,
  isInBranch,
  isInNestedLayer,
  updateLayersPointerEvent,
  disablePointerEventsOutside,
  clearPointerEvent,
};

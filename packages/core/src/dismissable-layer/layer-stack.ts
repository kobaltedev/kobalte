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

export interface LayerModel {
  node: HTMLElement;
  isPointerBlocking?: boolean;
  dismiss?: VoidFunction;
}

let originalBodyPointerEvents: string;
let hasDisabledBodyPointerEvents = false;

let layers: Array<LayerModel> = [];

function indexOf(node: HTMLElement | undefined) {
  return layers.findIndex(layer => layer.node === node);
}

function find(node: HTMLElement | undefined): LayerModel | undefined {
  return layers[indexOf(node)];
}

function isTopMostLayer(node: HTMLElement | null) {
  return layers[layers.length - 1].node === node;
}

function getPointerBlockingLayers() {
  return layers.filter(layer => layer.isPointerBlocking);
}

function getTopMostPointerBlockingLayer() {
  return [...getPointerBlockingLayers()].slice(-1)[0] as LayerModel | undefined;
}

function hasPointerBlockingLayer() {
  return getPointerBlockingLayers().length > 0;
}

function isBelowPointerBlockingLayer(node: HTMLElement) {
  const highestBlockingIndex = indexOf(getTopMostPointerBlockingLayer()?.node);
  return indexOf(node) < highestBlockingIndex;
}

function getNestedLayers(node: HTMLElement) {
  return Array.from(layers).slice(indexOf(node) + 1);
}

function isInNestedLayer(node: HTMLElement, target: Node | null) {
  return getNestedLayers(node).some(layer => contains(layer.node, target));
}

function addLayer(layer: LayerModel) {
  layers.push(layer);
}

function removeLayer(node: HTMLElement) {
  const index = indexOf(node);

  if (index < 0) {
    return;
  }

  // dismiss nested layers
  if (index < layers.length - 1) {
    const nestedLayers = getNestedLayers(node);
    nestedLayers.forEach(layer => layer.dismiss?.());
  }

  // remove this layer
  layers = removeItemFromArray(layers, layers[index]);
}

function assignPointerEventToLayers() {
  layers.forEach(({ node }) => {
    node.style.pointerEvents = isBelowPointerBlockingLayer(node) ? "none" : "auto";
  });
}

/**
 * Disable body `pointer-events` if there are "pointer blocking" layers in the stack,
 * and body `pointer-events` has not been disabled yet.
 */
function disableBodyPointerEvents(node: HTMLElement) {
  if (hasPointerBlockingLayer() && !hasDisabledBodyPointerEvents) {
    const ownerDocument = getDocument(node);

    originalBodyPointerEvents = document.body.style.pointerEvents;
    ownerDocument.body.style.pointerEvents = "none";

    hasDisabledBodyPointerEvents = true;
  }
}

/**
 * Restore body `pointer-events` style if there is no "pointer blocking" layer in the stack.
 */
function restoreBodyPointerEvents(node: HTMLElement) {
  if (hasPointerBlockingLayer()) {
    return;
  }

  const ownerDocument = getDocument(node);

  ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;

  if (ownerDocument.body.style.length === 0) {
    ownerDocument.body.removeAttribute("style");
  }

  hasDisabledBodyPointerEvents = false;
}

export const layerStack = {
  layers,
  isTopMostLayer,
  hasPointerBlockingLayer,
  isBelowPointerBlockingLayer,
  isInNestedLayer,
  addLayer,
  removeLayer,
  indexOf,
  find,
  assignPointerEventToLayers,
  disableBodyPointerEvents,
  restoreBodyPointerEvents,
};

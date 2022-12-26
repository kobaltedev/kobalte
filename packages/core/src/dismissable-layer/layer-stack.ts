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

import { contains, removeItemFromArray } from "@kobalte/utils";
import { Accessor, createMemo, createSignal } from "solid-js";

export interface LayerModel {
  node: Accessor<HTMLElement | undefined>;
  isPointerBlocking: Accessor<boolean | undefined>;
  dismiss: VoidFunction;
}

const [layers, setLayers] = createSignal<LayerModel[]>([]);

const pointerBlockingLayers = createMemo(() => {
  return layers().filter(layer => layer.isPointerBlocking);
});

const topMostPointerBlockingLayer = createMemo(() => {
  return [...pointerBlockingLayers()].slice(-1)[0] as LayerModel | undefined;
});

function indexOfLayer(node: HTMLElement | undefined) {
  return layers().findIndex(layer => layer.node() === node);
}

function isBelowPointerBlockingLayer(node: HTMLElement) {
  const highestBlockingIndex = indexOfLayer(topMostPointerBlockingLayer()?.node());
  return indexOfLayer(node) < highestBlockingIndex;
}

function isTopMostLayer(node: HTMLElement | null) {
  const items = layers();
  return items[items.length - 1].node() === node;
}

function getNestedLayers(node: HTMLElement) {
  return Array.from(layers()).slice(indexOfLayer(node) + 1);
}

function isInNestedLayer(node: HTMLElement, target: Node | null) {
  return getNestedLayers(node).some(layer => contains(layer.node(), target));
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

export const layerStack = {
  layers,
  pointerBlockingLayers,
  addLayer,
  removeLayer,
  isTopMostLayer,
  isBelowPointerBlockingLayer,
  isInNestedLayer,
};

/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */

import { access } from "@kobalte/utils";
import { Accessor, createEffect, createSignal, on } from "solid-js";

import { Collection, CollectionBase, CollectionNode } from "./types";
import { buildNodes } from "./utils";

type CollectionFactory<C extends Collection<CollectionNode>> = (
  node: Iterable<CollectionNode>
) => C;

export interface CreateCollectionProps<C extends Collection<CollectionNode>>
  extends CollectionBase {
  factory: CollectionFactory<C>;
}

export function createCollection<C extends Collection<CollectionNode>>(
  props: CreateCollectionProps<C>,
  deps: Array<Accessor<any>> = []
) {
  const initialNodes = buildNodes(access(props.dataSource));

  const [collection, setCollection] = createSignal<C>(props.factory(initialNodes));

  createEffect(
    on(
      [() => access(props.dataSource), () => props.factory, ...deps],
      ([dataSource, factory]) => {
        const nodes = buildNodes(dataSource);

        setCollection(() => factory(nodes));
      },
      {
        defer: true,
      }
    )
  );

  return collection;
}

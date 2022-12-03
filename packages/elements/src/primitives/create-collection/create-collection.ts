/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */

import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, createSignal } from "solid-js";

import { Collection, CollectionItem, CollectionNode, CollectionSection } from "./types";
import { buildNodes } from "./utils";

type CollectionFactory<C extends Collection<CollectionNode<any>>> = (
  node: Iterable<CollectionNode<any>>
) => C;

export interface CreateCollectionProps<
  SectionSource,
  ItemSource,
  C extends Collection<CollectionNode<SectionSource | ItemSource>>
> {
  dataSource: MaybeAccessor<Array<SectionSource | ItemSource>>;
  factory: CollectionFactory<C>;
  getItem: (source: ItemSource) => CollectionItem<ItemSource>;
  getSection?: (source: SectionSource) => CollectionSection<SectionSource, ItemSource>;
  deps?: Array<Accessor<any>>;
}

export function createCollection<
  SectionSource,
  ItemSource,
  C extends Collection<CollectionNode<SectionSource | ItemSource>>
>(props: CreateCollectionProps<SectionSource, ItemSource, C>) {
  const initialNodes = buildNodes({
    dataSource: access(props.dataSource),
    getItem: props.getItem,
    getSection: props.getSection,
  });

  const [collection, setCollection] = createSignal<C>(props.factory(initialNodes));

  createEffect(() => {
    // execute deps to track them
    props.deps?.forEach(f => f());

    const nodes = buildNodes({
      dataSource: access(props.dataSource),
      getItem: props.getItem,
      getSection: props.getSection,
    });

    setCollection(() => props.factory(nodes));
  });

  return collection;
}

/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/useListState.ts
 */

import { access } from "@kobalte/utils";
import { Accessor, createComputed, createMemo } from "solid-js";

import { Collection, CollectionBase, CollectionNode, createCollection } from "../primitives";
import {
  createMultipleSelectionState,
  MultipleSelectionStateProps,
  SelectionManager,
} from "../selection";
import { ListCollection } from "./list-collection";

export interface CreateListStateProps<SectionSource, ItemSource>
  extends CollectionBase<SectionSource, ItemSource>,
    MultipleSelectionStateProps {
  /** Filter function to generate a filtered list of nodes. */
  filter?: (
    nodes: Iterable<CollectionNode<SectionSource | ItemSource>>
  ) => Iterable<CollectionNode<SectionSource | ItemSource>>;
}

export interface ListState<T> {
  /** A collection of items in the list. */
  collection: Accessor<Collection<CollectionNode<T>>>;

  /** A set of items that are disabled. */
  disabledKeys: Accessor<Set<string>>;

  /** A selection manager to read and update multiple selection state. */
  selectionManager: Accessor<SelectionManager>;
}

/**
 * Provides state management for list-like components. Handles building a collection
 * of items from props, and manages multiple selection state.
 */
export function createListState<SectionSource, ItemSource>(
  props: CreateListStateProps<SectionSource, ItemSource>
): ListState<SectionSource | ItemSource> {
  const selectionState = createMultipleSelectionState(props);

  const disabledKeys = createMemo(() => {
    const disabledKeys = access(props.disabledKeys);
    return disabledKeys ? new Set(disabledKeys) : new Set<string>();
  });

  const factory = (nodes: Iterable<CollectionNode<SectionSource | ItemSource>>) => {
    return props.filter ? new ListCollection(props.filter(nodes)) : new ListCollection(nodes);
  };

  const collection = createCollection({
    dataSource: () => access(props.dataSource),
    getItem: props.getItem,
    getSection: props.getSection,
    factory,
    deps: [() => props.filter],
  });

  const selectionManager = createMemo(() => new SelectionManager(collection(), selectionState));

  // Reset focused key if that item is deleted from the collection.
  createComputed(() => {
    const focusedKey = selectionState.focusedKey();

    if (focusedKey != null && !collection().getItem(focusedKey)) {
      selectionState.setFocusedKey(undefined);
    }
  });

  return {
    collection,
    disabledKeys,
    selectionManager,
  };
}

/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/useListState.ts
 */

import { access } from "@kobalte/utils";
import { Accessor, createComputed } from "solid-js";

import { Collection, CollectionBase, CollectionNode, createCollection } from "../primitives";
import {
  createMultipleSelectionState,
  CreateMultipleSelectionStateProps,
  SelectionManager,
} from "../selection";
import { ListCollection } from "./list-collection";

export interface CreateListStateProps extends CollectionBase, CreateMultipleSelectionStateProps {}

export interface ListState {
  /** A collection of items in the list. */
  collection: Accessor<Collection<CollectionNode>>;

  /** A selection manager to read and update multiple selection state. */
  selectionManager: Accessor<SelectionManager>;
}

/**
 * Provides state management for list-like components.
 * Handles building a collection of items from props, and manages multiple selection state.
 */
export function createListState(props: CreateListStateProps): ListState {
  const selectionState = createMultipleSelectionState(props);

  const collection = createCollection({
    dataSource: () => access(props.dataSource),
    factory: nodes => {
      console.log("rerun", nodes);
      return new ListCollection(nodes);
    },
    getNode: props.getNode,
  });

  const selectionManager = new SelectionManager(collection, selectionState);

  // Reset focused key if that item is deleted from the collection.
  createComputed(() => {
    const focusedKey = selectionState.focusedKey();

    if (focusedKey != null && !collection().getItem(focusedKey)) {
      selectionState.setFocusedKey(undefined);
    }
  });

  return {
    collection,
    selectionManager: () => selectionManager,
  };
}

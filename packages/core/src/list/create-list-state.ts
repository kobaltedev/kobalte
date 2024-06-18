/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/useListState.ts
 */

import { access } from "@kobalte/utils";
import { type Accessor, createComputed } from "solid-js";

import {
	type Collection,
	type CollectionBase,
	type CollectionNode,
	createCollection,
} from "../primitives";
import {
	type CreateMultipleSelectionStateProps,
	SelectionManager,
	createMultipleSelectionState,
} from "../selection";
import { ListCollection } from "./list-collection";

export interface CreateListStateProps
	extends CollectionBase,
		CreateMultipleSelectionStateProps {
	/** Filter function to generate a filtered list of nodes. */
	filter?: (nodes: Iterable<CollectionNode>) => Iterable<CollectionNode>;
}

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

	const factory = (nodes: Iterable<CollectionNode>) => {
		return props.filter
			? new ListCollection(props.filter(nodes))
			: new ListCollection(nodes);
	};

	const collection = createCollection(
		{
			dataSource: () => access(props.dataSource),
			getKey: () => access(props.getKey),
			getTextValue: () => access(props.getTextValue),
			getDisabled: () => access(props.getDisabled),
			getSectionChildren: () => access(props.getSectionChildren),
			factory,
		},
		[() => props.filter],
	);

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

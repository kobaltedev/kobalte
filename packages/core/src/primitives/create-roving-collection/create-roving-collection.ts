import type { Accessor, FlowComponent } from "solid-js";

import { type ListState, createListState } from "../../list";
import type { CollectionItemWithRef } from "../create-collection";
import { createDomCollection } from "../create-dom-collection";

export interface RovingCollection {
	/** Registers the dom collection provider for this group's items. */
	DomCollectionProvider: FlowComponent;

	/** The list state driving which item (if any) currently has roving focus. */
	listState: Accessor<ListState>;

	/** Moves roving focus to the item registered under `key`. */
	focusItemAt: (key: string) => void;
}

/**
 * Provides a dom collection and roving-tabindex list state for a group of
 * focusable items that aren't a selection list (e.g. removable chips) —
 * only one item is ever focused, never "selected".
 */
export function createRovingCollection(): RovingCollection {
	const { DomCollectionProvider, items } =
		createDomCollection<CollectionItemWithRef>();

	const listState = createListState({
		dataSource: items,
		selectionMode: () => "none",
		disallowEmptySelection: () => false,
	});

	const focusItemAt = (key: string) => {
		const manager = listState.selectionManager();
		manager.setFocused(true);
		manager.setFocusedKey(key);
	};

	return {
		DomCollectionProvider,
		listState: () => listState,
		focusItemAt,
	};
}

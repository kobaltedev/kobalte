/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection.tsx
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-item.ts
 */

import { type MaybeAccessor, access, addItemToArray } from "@kobalte/utils";
import { type FlowComponent, createComponent } from "solid-js";

import { createControllableArraySignal } from "../index";
import {
	DomCollectionContext,
	type DomCollectionContextValue,
} from "./dom-collection-context";
import type { DomCollectionItem } from "./types";
import { createSortBasedOnDOMPosition, findDOMIndex } from "./utils";

export interface CreateDomCollectionProps<
	T extends DomCollectionItem = DomCollectionItem,
> {
	/** The controlled items state of the collection. */
	items?: MaybeAccessor<Array<T> | undefined>;

	/** Event handler called when the items state of the collection changes. */
	onItemsChange?: (items: Array<T>) => void;
}

export function createDomCollection<
	T extends DomCollectionItem = DomCollectionItem,
>(props: CreateDomCollectionProps<T> = {}) {
	const [items, setItems] = createControllableArraySignal({
		value: () => access(props.items),
		onChange: (value) => props.onItemsChange?.(value),
	});

	createSortBasedOnDOMPosition(items, setItems);

	const registerItem = (item: T) => {
		setItems((prevItems) => {
			// Finds the item group based on the DOM hierarchy
			const index = findDOMIndex(prevItems, item);
			return addItemToArray(prevItems, item, index);
		});

		return () => {
			setItems((prevItems) => {
				const nextItems = prevItems.filter(
					(prevItem) => prevItem.ref() !== item.ref(),
				);

				if (prevItems.length === nextItems.length) {
					// The item isn't registered, so do nothing
					return prevItems;
				}

				return nextItems;
			});
		};
	};

	const DomCollectionProvider: FlowComponent = (props) => {
		return createComponent(DomCollectionContext.Provider, {
			value: { registerItem } as DomCollectionContextValue,
			get children() {
				return props.children;
			},
		});
	};

	return { DomCollectionProvider };
}

/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection.tsx
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-item.ts
 */

import type { MaybeAccessor } from "@solid-primitives/utils";
import {
	createComponent,
	createEffect,
	createSignal,
	type FlowComponent,
} from "solid-js";

import {
	DomCollectionContext,
	type DomCollectionContextValue,
} from "./dom-collection-context.ts";
import type { DomCollectionItem } from "./types.ts";
import { createSortBasedOnDOMPosition, findDOMIndex } from "./utils.ts";

export interface CreateDomCollectionProps<
	T extends DomCollectionItem = DomCollectionItem,
> {
	/**
	 * @deprecated Not used internally. Callers should use the `items` accessor
	 * returned by `createDomCollection` as the data source instead.
	 */
	items?: MaybeAccessor<Array<T> | undefined>;

	/** Event handler called when the items state of the collection changes. */
	onItemsChange?: (items: Array<T>) => void;
}

export function createDomCollection<
	T extends DomCollectionItem = DomCollectionItem,
>(props: CreateDomCollectionProps<T> = {}) {
	// Use a plain signal so function-form setters accumulate correctly across a
	// Solid 2.0 microtask flush. createControllableArraySignal eagerly resolved
	// the prev-value, causing each concurrent registerItem call to see the stale
	// empty array — the last write won and earlier items were lost.
	// `ownedWrite: true` because `registerItem`'s cleanup (below) unregisters
	// the item by writing to this signal from inside Solid's disposal phase
	// when a `<For>`-rendered item is removed — an owned-scope write Solid 2.0
	// otherwise rejects.
	const [items, setItems] = createSignal<T[]>([], { ownedWrite: true });

	createSortBasedOnDOMPosition(items, setItems);

	// Notify external listeners after items settle (defer skips the initial [] state).
	createEffect(
		() => items(),
		(currentItems) => {
			props.onItemsChange?.(currentItems);
		},
		{ defer: true },
	);

	const registerItem = (item: T) => {
		setItems((prevItems) => {
			// Finds the item group based on the DOM hierarchy
			const index = findDOMIndex(prevItems, item);
			return index >= 0 && index < prevItems.length
				? [...prevItems.slice(0, index), item, ...prevItems.slice(index)]
				: [...prevItems, item];
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
		return createComponent(DomCollectionContext, {
			value: { registerItem } as DomCollectionContextValue,
			get children() {
				return props.children;
			},
		});
	};

	return { DomCollectionProvider, items };
}

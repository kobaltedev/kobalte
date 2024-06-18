/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 */

import { getDocument } from "@kobalte/utils";
import { type Accessor, createEffect, onCleanup } from "solid-js";

import type { DomCollectionItem } from "./types";

function isElementPreceding(a: Element, b: Element) {
	return Boolean(
		b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING,
	);
}

export function findDOMIndex(
	items: DomCollectionItem[],
	item: DomCollectionItem,
) {
	const itemEl = item.ref();

	if (!itemEl) {
		return -1;
	}

	let length = items.length;

	if (!length) {
		return -1;
	}

	// Most of the time, the new item will be added at the end of the list, so we
	// do a findIndex in reverse order, instead of wasting time searching the
	// index from the beginning.
	while (length--) {
		const currentItemEl = items[length]?.ref();

		if (!currentItemEl) {
			continue;
		}

		if (isElementPreceding(currentItemEl, itemEl)) {
			return length + 1;
		}
	}
	return 0;
}

function sortBasedOnDOMPosition<T extends DomCollectionItem>(items: T[]) {
	const pairs = items.map((item, index) => [index, item] as const);
	let isOrderDifferent = false;

	pairs.sort(([indexA, a], [indexB, b]) => {
		const elementA = a.ref();
		const elementB = b.ref();

		if (elementA === elementB) {
			return 0;
		}

		if (!elementA || !elementB) {
			return 0;
		}

		// a before b
		if (isElementPreceding(elementA, elementB)) {
			if (indexA > indexB) {
				isOrderDifferent = true;
			}
			return -1;
		}

		// a after b
		if (indexA < indexB) {
			isOrderDifferent = true;
		}

		return 1;
	});

	if (isOrderDifferent) {
		return pairs.map(([_, item]) => item);
	}

	return items;
}

function setItemsBasedOnDOMPosition<T extends DomCollectionItem>(
	items: T[],
	setItems: (items: T[]) => any,
) {
	const sortedItems = sortBasedOnDOMPosition(items);

	if (items !== sortedItems) {
		setItems(sortedItems);
	}
}

function getCommonParent(items: DomCollectionItem[]) {
	const firstItem = items[0];
	const lastItemEl = items[items.length - 1]?.ref();
	let parentEl = firstItem?.ref()?.parentElement;

	while (parentEl) {
		if (lastItemEl && parentEl.contains(lastItemEl)) {
			return parentEl;
		}

		parentEl = parentEl.parentElement;
	}

	return getDocument(parentEl).body;
}

function createTimeoutObserver<T extends DomCollectionItem = DomCollectionItem>(
	items: Accessor<T[]>,
	setItems: (items: T[]) => any,
) {
	createEffect(() => {
		const timeout = setTimeout(() => {
			setItemsBasedOnDOMPosition(items(), setItems);
		});

		onCleanup(() => clearTimeout(timeout));
	});
}

export function createSortBasedOnDOMPosition<
	T extends DomCollectionItem = DomCollectionItem,
>(items: Accessor<T[]>, setItems: (items: T[]) => any) {
	// JSDOM doesn't support IntersectionObserver. See https://github.com/jsdom/jsdom/issues/2032
	if (typeof IntersectionObserver !== "function") {
		createTimeoutObserver(items, setItems);
		return;
	}

	let previousItems: T[] = [];

	createEffect(() => {
		const callback = () => {
			const hasPreviousItems = !!previousItems.length;
			previousItems = items();

			// We don't want to sort items if items have been just registered.
			if (!hasPreviousItems) {
				return;
			}

			setItemsBasedOnDOMPosition(items(), setItems);
		};

		const root = getCommonParent(items());
		const observer = new IntersectionObserver(callback, { root });

		for (const item of items()) {
			const itemEl = item.ref();

			if (itemEl) {
				observer.observe(itemEl);
			}
		}

		onCleanup(() => observer.disconnect());
	});
}

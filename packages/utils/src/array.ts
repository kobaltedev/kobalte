/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit-utils/src/array.ts
 */

/**
 * Immutably adds an item at the given index to an array.
 */
export function addItemToArray<T extends any[]>(
	array: T,
	item: T[number],
	index = -1,
) {
	if (!(index in array)) {
		return [...array, item] as T;
	}
	return [...array.slice(0, index), item, ...array.slice(index)] as T;
}

/**
 * Immutably removes an item from an array.
 */
export function removeItemFromArray<T>(array: T[], item: T) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);

	if (index !== -1) {
		updatedArray.splice(index, 1);
	}

	return updatedArray;
}

/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit-utils/src/array.ts
 */

/**
 * Immutably adds an index to an array.
 * @example
 * addItemToArray(["a", "b", "d"], "c", 2); // ["a", "b", "c", "d"]
 * @returns {Array} A new array with the item in the passed array index.
 */
export function addItemToArray<T extends any[]>(array: T, item: T[number], index = -1) {
  if (!(index in array)) {
    return [...array, item] as T;
  }
  return [...array.slice(0, index), item, ...array.slice(index)] as T;
}

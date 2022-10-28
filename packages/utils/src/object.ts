/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/object.ts
 */

import { Dict, FilterFn } from "./types";

/**
 * Returns the items of an object that meet the condition specified in a callback function.
 *
 * @param object the object to loop through
 * @param fn The filter function
 */
export function objectFilter<T extends Dict>(object: T, fn: FilterFn<T>) {
  const result: Dict = {};

  Object.keys(object).forEach(key => {
    const value = object[key];
    const shouldPass = fn(value, key, object);

    if (shouldPass) {
      result[key] = value;
    }
  });

  return result;
}

export function filterUndefined<T extends Dict = Dict>(object: T) {
  return objectFilter(object, val => val !== null && val !== undefined);
}

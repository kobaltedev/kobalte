/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/assertion.ts
 */

// Number assertions
export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

// Array assertions
export function isArray<T>(value: unknown): value is Array<T> {
	return Array.isArray(value);
}

// String assertions
export function isString(value: unknown): value is string {
	return Object.prototype.toString.call(value) === "[object String]";
}

// Function assertions
export function isFunction<T extends Function = Function>(
	value: unknown,
): value is T {
	return typeof value === "function";
}

import type { Accessor } from "solid-js";

/**
 * Create a function that generate an id from a `baseId` and `suffix`.
 */
export function createGenerateId(baseId: Accessor<string>) {
	return (suffix: string) => `${baseId()}-${suffix}`;
}

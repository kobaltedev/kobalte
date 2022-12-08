import { JSX } from "solid-js";
import Accessor = JSX.Accessor;

/**
 * Create a function that generate an id from a `baseId` and `suffix`.
 */
export function createGenerateId(baseId: Accessor<string>) {
  return (suffix: string) => `${baseId()}-${suffix}`;
}

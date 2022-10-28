/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/assertion.ts
 */

import { Dict } from "./types";

// String assertions
export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

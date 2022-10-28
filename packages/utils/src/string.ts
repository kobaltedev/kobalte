import { isString } from "./assertion";

export function stringOrUndefined(value: any) {
  return isString(value) ? value : undefined;
}

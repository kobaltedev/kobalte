import { isArray } from "./assertion";

export function pack<T>(value: T | T[]): Array<T> {
  if (value == null) {
    return [];
  }

  return isArray(value) ? value : [value];
}

import { mergeProps } from "solid-js";

export function mergeDefaultProps<T extends Record<string, any>>(
  defaultProps: Partial<T>,
  props: T
): T {
  return mergeProps(defaultProps, props);
}

import { mergeProps, useContext } from "solid-js";

import {
  ComponentConfig,
  ComponentConfigContext,
} from "./component-config-context";

/**
 * Merge default, global config and component props into a single props object.
 * @param name The name of the component to look for in the config.
 * @param defaultProps The default props, will be overridden by config and component props.
 * @param props The component `props` object.
 * @example
 * // mergedProps = defaultProps <== configProps <== props
 */
export function mergeComponentConfigProps<T extends Record<string, any>>(
  name: keyof ComponentConfig,
  defaultProps: Partial<T>,
  props: T
): T {
  const configProps = useContext(ComponentConfigContext)[name] ?? {};

  return mergeProps(defaultProps, configProps, props);
}

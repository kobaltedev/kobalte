import { createContext, mergeProps, useContext } from "solid-js";

import { VariantSelection } from "../polymorphic";

export type ComponentConfig<
  Props extends VariantSelection<any> = {},
  Keys extends keyof Props = never
> = {
  /** The default props to be passed to the component. */
  defaultProps?: Pick<Props, Keys>;
};

export type ComponentConfigs = Record<string, ComponentConfig>;

export const ComponentConfigsContext = createContext<ComponentConfigs>({});

/**
 * Merge default, global config and component props into a single props object.
 * @param name The name of the component to look for in the config.
 * @param defaultProps The default props, will be overridden by config and component props.
 * @param props The component `props` object.
 * @example
 * // mergedProps = defaultProps <== configProps <== props
 */
export function mergeConfigProps<T extends Record<string, any>>(
  name: string,
  defaultProps: Partial<T>,
  props: T
): T {
  const configs = useContext(ComponentConfigsContext);

  const configProps = () => configs[name]?.defaultProps ?? {};

  return mergeProps(defaultProps, configProps, props);
}

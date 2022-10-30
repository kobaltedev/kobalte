/*!
 * Original code by Mantinedev
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-styles/src/theme/MantineProvider.tsx
 */

import {
  Accessor,
  createContext,
  createMemo,
  mergeProps,
  ParentProps,
  useContext,
} from "solid-js";

import type { ComponentConfig, ComponentsConfig } from "./types";

const ComponentsConfigContext = createContext<ComponentsConfig>({});

export function useComponentConfig(
  component?: string
): Accessor<ComponentConfig | undefined> {
  const configs = useContext(ComponentsConfigContext);

  return createMemo(() => {
    if (component == null) {
      return undefined;
    }

    return (configs[component] as ComponentConfig) ?? undefined;
  });
}

/**
 * Merge default, global config and component props into a single props object.
 * @param name The name of the component to look for in the config.
 * @param defaultProps The default props, will be overridden by config and component props.
 * @param props The component `props` object.
 * @example
 * // mergedProps = defaultProps <== configProps <== props
 */
export function mergeComponentConfigProps<T extends Record<string, any>>(
  name: string,
  defaultProps: Partial<T>,
  props: T
): T {
  const configs = useContext(ComponentsConfigContext);

  const configProps = () => configs[name]?.defaultProps ?? {};

  return mergeProps(defaultProps, configProps, props);
}

export interface ComponentsConfigProviderProps extends ParentProps {
  /** The defaultProps and class composition configuration for components. */
  components?: ComponentsConfig;
}

export function ComponentsConfigProvider(props: ComponentsConfigProviderProps) {
  return (
    <ComponentsConfigContext.Provider value={props.components ?? {}}>
      {props.children}
    </ComponentsConfigContext.Provider>
  );
}

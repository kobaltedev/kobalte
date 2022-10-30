import { ColorModeProvider, ColorModeProviderProps } from "../color-mode";
import {
  ComponentConfigs,
  ComponentConfigsContext,
} from "../component-configs";
import { watchModals } from "../modal";
import { mergeDefaultProps } from "../utils";

interface KobalteProviderProps extends ColorModeProviderProps {
  /** DefaultProps and class composition configuration for components. */
  componentConfigs?: ComponentConfigs;
}

export function KobalteProvider(props: KobalteProviderProps) {
  watchModals();

  props = mergeDefaultProps({ initialColorMode: "system" }, props);

  return (
    <ColorModeProvider
      initialColorMode={props.initialColorMode}
      storageManager={props.storageManager}
      disableTransitionOnChange={props.disableTransitionOnChange}
    >
      <ComponentConfigsContext.Provider value={props.componentConfigs ?? {}}>
        {props.children}
      </ComponentConfigsContext.Provider>
    </ColorModeProvider>
  );
}

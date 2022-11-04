import { createContext } from "solid-js";

export interface ComponentConfig {
  // ex: Button?: => ButtonConfig => Pick<ButtonProps, "variant" | "size" | "color">
}

export const ComponentConfigContext = createContext<ComponentConfig | undefined>({});

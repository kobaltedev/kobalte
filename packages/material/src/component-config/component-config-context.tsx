import { createContext } from "solid-js";

import { ButtonConfig } from "../button";

export interface ComponentConfig {
  Button?: ButtonConfig;
}

export const ComponentConfigContext = createContext<ComponentConfig | undefined>({});

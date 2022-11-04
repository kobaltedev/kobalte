import { createContext } from "solid-js";

import { ButtonConfig } from "../button";
import { DividerConfig } from "../divider";

export interface ComponentConfig {
  Button?: ButtonConfig;
  Divider?: DividerConfig;
}

export const ComponentConfigContext = createContext<ComponentConfig | undefined>({});

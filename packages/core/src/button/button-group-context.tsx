import { createContext, useContext } from "solid-js";

import { ButtonGroupContextValue } from "./types";

export const ButtonGroupContext = createContext<ButtonGroupContextValue>();

export function useButtonGroupContext() {
  return useContext(ButtonGroupContext);
}

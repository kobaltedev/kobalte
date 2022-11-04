import { createContext, useContext } from "solid-js";

import { ButtonContextValue } from "./types";

export const ButtonContext = createContext<ButtonContextValue>();

export function useButtonContext() {
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error("[kobalte]: `useButtonContext` must be used within a `Button` component");
  }

  return context;
}

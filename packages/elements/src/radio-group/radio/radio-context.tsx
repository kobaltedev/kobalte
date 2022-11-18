import { Accessor, createContext, useContext } from "solid-js";

export interface RadioContextValue {
  value: Accessor<string>;
  isSelected: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
}

export const RadioContext = createContext<RadioContextValue>();

export function useRadioContext() {
  const context = useContext(RadioContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useRadioContext` must be used within a `Radio` component");
  }

  return context;
}

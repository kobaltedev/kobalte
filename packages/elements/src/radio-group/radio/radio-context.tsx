import { Accessor, createContext, useContext } from "solid-js";

export interface RadioDataAttrs {
  "data-checked": string | undefined;
  "data-disabled": string | undefined;
  "data-hover": string | undefined;
  "data-focus": string | undefined;
  "data-focus-visible": string | undefined;
}

export interface RadioContextValue {
  value: Accessor<string>;
  dataAttrs: Accessor<RadioDataAttrs>;
  isSelected: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  setIsFocused: (isFocused: boolean) => void;
  setIsFocusVisible: (isFocusVisible: boolean) => void;
}

export const RadioContext = createContext<RadioContextValue>();

export function useRadioContext() {
  const context = useContext(RadioContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useRadioContext` must be used within a `Radio` component");
  }

  return context;
}

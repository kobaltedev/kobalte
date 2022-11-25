import { Accessor, createContext, useContext } from "solid-js";

export interface RadioDataSet {
  "data-valid": string | undefined;
  "data-invalid": string | undefined;
  "data-checked": string | undefined;
  "data-disabled": string | undefined;
  "data-hover": string | undefined;
  "data-focus": string | undefined;
  "data-focus-visible": string | undefined;
}

export interface RadioContextValue {
  value: Accessor<string>;
  dataset: Accessor<RadioDataSet>;
  ariaLabel: Accessor<string | undefined>;
  ariaLabelledBy: Accessor<string | undefined>;
  ariaDescribedBy: Accessor<string | undefined>;
  isSelected: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  generateId: (part: string) => string;
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

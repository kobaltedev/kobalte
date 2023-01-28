import { Accessor, createContext, useContext } from "solid-js";

export interface RadioGroupItemDataSet {
  "data-valid": string | undefined;
  "data-invalid": string | undefined;
  "data-checked": string | undefined;
  "data-disabled": string | undefined;
}

export interface RadioGroupItemContextValue {
  value: Accessor<string>;
  dataset: Accessor<RadioGroupItemDataSet>;
  isSelected: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  generateId: (part: string) => string;
  setIsFocused: (isFocused: boolean) => void;
}

export const RadioGroupItemContext = createContext<RadioGroupItemContextValue>();

export function useRadioGroupItemContext() {
  const context = useContext(RadioGroupItemContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component"
    );
  }

  return context;
}

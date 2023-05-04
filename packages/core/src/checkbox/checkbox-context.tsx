import { Accessor, createContext, useContext } from "solid-js";

export interface CheckboxDataSet {
  "data-checked": string | undefined;
  "data-indeterminate": string | undefined;
}

export interface CheckboxContextValue {
  name: Accessor<string | undefined>;
  value: Accessor<string>;
  dataset: Accessor<CheckboxDataSet>;
  checked: Accessor<boolean>;
  indeterminate: Accessor<boolean>;
  generateId: (part: string) => string;
  toggle: () => void;
  setIsChecked: (isChecked: boolean) => void;
  setIsFocused: (isFocused: boolean) => void;
}

export const CheckboxContext = createContext<CheckboxContextValue>();

export function useCheckboxContext() {
  const context = useContext(CheckboxContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useCheckboxContext` must be used within a `Checkbox` component");
  }

  return context;
}

import { ValidationState } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

export interface CheckboxDataSet {
  "data-valid": string | undefined;
  "data-invalid": string | undefined;
  "data-checked": string | undefined;
  "data-indeterminate": string | undefined;
  "data-required": string | undefined;
  "data-disabled": string | undefined;
  "data-readonly": string | undefined;
}

export interface CheckboxContextValue {
  name: Accessor<string | undefined>;
  value: Accessor<string>;
  dataset: Accessor<CheckboxDataSet>;
  validationState: Accessor<ValidationState | undefined>;
  checked: Accessor<boolean>;
  required: Accessor<boolean>;
  disabled: Accessor<boolean>;
  readOnly: Accessor<boolean>;
  indeterminate: Accessor<boolean>;
  generateId: (part: string) => string;
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

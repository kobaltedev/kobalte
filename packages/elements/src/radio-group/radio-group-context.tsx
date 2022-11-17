import { ValidationState } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

export interface RadioGroupContextValue {
  selectedValue: Accessor<string | undefined>;
  setSelectedValue: (value: string) => void;
  name: Accessor<string>;
  validationState: Accessor<ValidationState | undefined>;
  required: Accessor<boolean | undefined>;
  disabled: Accessor<boolean | undefined>;
  readOnly: Accessor<boolean | undefined>;
  getPartId: (part: string) => string;
  allAriaDescribedBy: Accessor<string | undefined>;
  setAriaLabelledBy: (id: string | undefined) => void;
  setAriaDescribedBy: (id: string | undefined) => void;
  setAriaErrorMessage: (id: string | undefined) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue>();

export function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component"
    );
  }

  return context;
}

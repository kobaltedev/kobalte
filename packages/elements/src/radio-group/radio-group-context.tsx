import { ValidationState } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

export interface RadioGroupContextValue {
  value: Accessor<string | undefined>;
  onValueChange: (value: string) => void;
  name: Accessor<string>;
  validationState: Accessor<ValidationState | undefined>;
  required: Accessor<boolean | undefined>;
  disabled: Accessor<boolean | undefined>;
  readOnly: Accessor<boolean | undefined>;
  getPartId: (part: string) => string;
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

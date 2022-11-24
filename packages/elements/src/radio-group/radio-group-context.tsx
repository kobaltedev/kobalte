import { ValidationState } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

export interface RadioGroupDataSet {
  "data-valid": string | undefined;
  "data-invalid": string | undefined;
  "data-required": string | undefined;
  "data-disabled": string | undefined;
  "data-readonly": string | undefined;
}

export interface RadioGroupContextValue {
  isSelectedValue: (value: string) => boolean;
  setSelectedValue: (value: string | undefined) => void;
  name: Accessor<string>;
  dataset: Accessor<RadioGroupDataSet>;
  validationState: Accessor<ValidationState | undefined>;
  isRequired: Accessor<boolean | undefined>;
  isDisabled: Accessor<boolean | undefined>;
  isReadOnly: Accessor<boolean | undefined>;
  getPartId: (part: string) => string;
  ariaDescribedBy: Accessor<string | undefined>;
  registerLabel: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
  registerErrorMessage: (id: string) => () => void;
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

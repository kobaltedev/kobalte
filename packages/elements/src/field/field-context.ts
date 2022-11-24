import { ValidationState } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

export interface FieldDataSet {
  "data-valid": string | undefined;
  "data-invalid": string | undefined;
  "data-required": string | undefined;
  "data-disabled": string | undefined;
  "data-readonly": string | undefined;
}

export interface FieldContextValue {
  name: Accessor<string>;
  dataset: Accessor<FieldDataSet>;
  validationState: Accessor<ValidationState | undefined>;
  isRequired: Accessor<boolean | undefined>;
  isDisabled: Accessor<boolean | undefined>;
  isReadOnly: Accessor<boolean | undefined>;
  inputId: Accessor<string | undefined>;
  generateFieldPartId: (part: string) => string;
  registerLabel: (id: string) => () => void;
  registerInput: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
  registerErrorMessage: (id: string) => () => void;
}

export const FieldContext = createContext<FieldContextValue>();

export function useFieldContext() {
  const context = useContext(FieldContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useFieldContext` must be used within a `Field` component");
  }

  return context;
}

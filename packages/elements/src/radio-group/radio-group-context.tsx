import { createContext, useContext } from "solid-js";

export interface RadioGroupContextValue {
  isSelectedValue: (value: string) => boolean;
  setSelectedValue: (value: string | undefined) => void;
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

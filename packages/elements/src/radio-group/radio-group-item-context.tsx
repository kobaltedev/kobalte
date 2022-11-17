import { Accessor, createContext, useContext } from "solid-js";

export interface RadioGroupItemContextValue {
  isFocused: Accessor<boolean>;
  isFocusVisible: Accessor<boolean>;
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

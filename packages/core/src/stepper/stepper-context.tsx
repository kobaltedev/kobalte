import { type Accessor, type JSX, type Setter, createContext, useContext } from "solid-js";

export interface StepperContextValue {
  step: Accessor<number>;
  setStep: Setter<number>;
  isDisabled: Accessor<boolean>;
  isCompleted: Accessor<boolean>;
  maxSteps: Accessor<number>;
  isLastStep: Accessor<boolean>;
}

export const StepperContext = createContext<StepperContextValue>();

export function useStepperContext() {
  const context = useContext(StepperContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useStepperContext` must be used within a `Stepper` component"
    );
  }

  return context;
}

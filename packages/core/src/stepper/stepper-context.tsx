// src/stepper/stepper-context.ts
import { createContext, useContext } from "solid-js";
import type { StepperContextType } from "./stepper.types";

export const StepperContext = createContext<StepperContextType>();

export function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error(
      "[kobalte] `useStepperContext` must be used within a `Stepper` component"
    );
  }
  return context;
}

// src/stepper/stepper-separator.tsx
import { type Component } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperSeparatorOptions {}

export interface StepperSeparatorProps extends StepperSeparatorOptions {}

export const StepperSeparator: Component<StepperSeparatorProps> = () => {
  const context = useStepperContext();
  const options = context.options();

  return (
    <div
      class="kb-stepper__separator"
      role="separator"
      aria-orientation={options.orientation}
    />
  );
};


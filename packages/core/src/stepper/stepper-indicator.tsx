// src/stepper/stepper-indicator.tsx
import { type Component, type JSX } from "solid-js";

export interface StepperIndicatorOptions {}

export interface StepperIndicatorProps extends StepperIndicatorOptions {
  /** The indicator content. */
  children?: JSX.Element;
}

export const StepperIndicator: Component<StepperIndicatorProps> = (props) => {
  return (
    <div class="kb-stepper__indicator" role="presentation">
      {props.children}
    </div>
  );
};


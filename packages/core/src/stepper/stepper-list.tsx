// src/stepper/stepper-list.tsx
import { type Component, type JSX } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperListOptions {}

export interface StepperListProps extends StepperListOptions {
  /** The list content. */
  children?: JSX.Element;
}

export const StepperList: Component<StepperListProps> = (props) => {
  const context = useStepperContext();
  const options = context.options();

  return (
    <div
      class="kb-stepper__list"
      data-orientation={options.orientation}
      role="tablist"
      aria-orientation={options.orientation}
    >
      {props.children}
    </div>
  );
};


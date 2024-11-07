// src/stepper/stepper-item.tsx
import { type Component, type JSX, createMemo } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperItemOptions {
  /** The index of the step. */
  index: number;
}

export interface StepperItemProps extends StepperItemOptions {
  /** The item content. */
  children?: JSX.Element;
}

export const StepperItem: Component<StepperItemProps> = (props) => {
  const context = useStepperContext();
  const options = context.options();

  const isActive = createMemo(() => context.state.activeStep === props.index);
  const isCompleted = createMemo(() => context.state.activeStep > props.index);
  const isSelectable = createMemo(() =>
    options.allowNextStepsSelect || props.index <= context.state.activeStep
  );

  return (
    <div
      class="kb-stepper__item"
      data-active={isActive()}
      data-completed={isCompleted()}
      data-disabled={!isSelectable()}
    >
      {props.children}
    </div>
  );
};


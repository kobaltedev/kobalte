// src/stepper/stepper-trigger.tsx
import { type Component, type JSX } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperTriggerOptions {}

export interface StepperTriggerProps extends StepperTriggerOptions {
  /** The index of the step. */
  index: number;
  /** The trigger content. */
  children?: JSX.Element;
}

export const StepperTrigger: Component<StepperTriggerProps> = (props) => {
  const context = useStepperContext();
  const options = context.options();

  const isSelectable = () =>
    options.allowNextStepsSelect || props.index <= context.state.activeStep;

  const handleClick = () => {
    if (!isSelectable()) return;

    context.setState({ activeStep: props.index });
    options.onActiveStepChange?.(props.index);
  };

  return (
    <button
      class="kb-stepper__trigger"
      role="tab"
      aria-selected={context.state.activeStep === props.index}
      disabled={!isSelectable()}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};


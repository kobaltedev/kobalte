// src/stepper/stepper-navigation.tsx
import { type Component, type JSX } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperNavigationOptions {
  /** Custom previous button text */
  prevText?: string;
  /** Custom next button text */
  nextText?: string;
}

export interface StepperNavigationProps extends StepperNavigationOptions {}

export const StepperNavigation: Component<StepperNavigationProps> = (props) => {
  const context = useStepperContext();
  const options = context.options();

  const handlePrev = () => {
    if (context.state.activeStep > 0) {
      const newStep = context.state.activeStep - 1;
      context.setState({ activeStep: newStep });
      options.onActiveStepChange?.(newStep);
    }
  };

  const handleNext = () => {
    if (context.state.activeStep < options.count) {
      const newStep = context.state.activeStep + 1;
      context.setState({ activeStep: newStep });
      options.onActiveStepChange?.(newStep);
    }
  };

  return (
    <div class="kb-stepper__navigation">
      <button
        class="kb-stepper__prev-button"
        onClick={handlePrev}
        disabled={context.state.activeStep === 0}
      >
        {props.prevText || "Previous"}
      </button>
      <button
        class="kb-stepper__next-button"
        onClick={handleNext}
        disabled={context.state.activeStep >= options.count}
      >
        {props.nextText || "Next"}
      </button>
    </div>
  );
};


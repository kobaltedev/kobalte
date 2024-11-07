// src/stepper/stepper-completed-content.tsx
import { type Component, type JSX, Show } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperCompletedContentOptions {}

export interface StepperCompletedContentProps extends StepperCompletedContentOptions {
  /** The completed content. */
  children?: JSX.Element;
}

export const StepperCompletedContent: Component<StepperCompletedContentProps> = (props) => {
  const context = useStepperContext();
  const options = context.options();

  const isCompleted = () => context.state.activeStep >= options.count;

  return (
    <Show when={isCompleted()}>
      <div
        class="kb-stepper__completed"
        role="tabpanel"
        aria-label="All steps completed"
      >
        {props.children}
      </div>
    </Show>
  );
};

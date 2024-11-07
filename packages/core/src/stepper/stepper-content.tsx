// src/stepper/stepper-content.tsx
import { type Component, type JSX, Show } from "solid-js";
import { useStepperContext } from "./stepper-context";

export interface StepperContentOptions {
	/** The index of the step content. */
	index: number;
}

export interface StepperContentProps extends StepperContentOptions {
	/** The content. */
	children?: JSX.Element;
}

export const StepperContent: Component<StepperContentProps> = (props) => {
	const context = useStepperContext();

	return (
		<Show when={context.state.activeStep === props.index}>
			<div
				class="kb-stepper__content"
				role="tabpanel"
				id={`step-content-${props.index}`}
				aria-labelledby={`step-trigger-${props.index}`}
			>
				{props.children}
			</div>
		</Show>
	);
};


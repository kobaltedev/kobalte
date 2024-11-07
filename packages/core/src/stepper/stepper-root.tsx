// src/stepper/stepper-root.tsx
import { type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { mergeDefaultProps } from "@kobalte/utils";
import { StepperContext } from "./stepper-context";
import type { StepperRootOptions, StepperState } from "./stepper.types";

export interface StepperRootProps extends StepperRootOptions {
	/** The stepper content. */
	children?: JSX.Element;
}

export const StepperRoot: Component<StepperRootProps> = (originalProps) => {
	const props = mergeDefaultProps(
		{
			defaultActiveStep: 0,
			allowNextStepsSelect: true,
			orientation: "horizontal",
		} as Partial<StepperRootProps>,
		originalProps
	);

	const [state, setState] = createStore<StepperState>({
		activeStep: props.activeStep ?? props.defaultActiveStep!,
		isNavigating: false,
	});

	const options = (): StepperRootOptions => {
		const {
			activeStep,
			defaultActiveStep,
			onActiveStepChange,
			count,
			allowNextStepsSelect,
			orientation
		} = props;

		return {
			activeStep: state.activeStep,
			defaultActiveStep,
			onActiveStepChange,
			count,
			allowNextStepsSelect,
			orientation
		};
	};

	return (
		<StepperContext.Provider value={{ state, setState, options }}>
			<div
				class="kb-stepper"
				data-orientation={props.orientation}
				role="navigation"
				aria-label="Stepper navigation"
			>
				{props.children}
			</div>
		</StepperContext.Provider>
	);
};


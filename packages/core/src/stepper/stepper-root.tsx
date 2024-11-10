import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	createMemo,
	createUniqueId,
	splitProps,
} from "solid-js";

import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { createControllableSignal } from "../primitives";
import { StepperContext, type StepperContextValue } from "./stepper-context";

export interface StepperRootOptions {
	/** The controlled step of the stepper. */
	step?: number;

	/** The default step when initially rendered. Useful when you do not need to control the step state. */
	defaultStep?: number;

	/** Event handler called when the step changes. */
	onStepChange?: (step: number) => void;

	/** Whether the stepper is disabled. */
	disabled?: boolean;

  /** The maximum number of steps in the stepper. */
  maxSteps: number;
}

export interface StepperRootCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
	children?: JSX.Element;
}

export interface StepperRootRenderProps extends StepperRootCommonProps {
	"data-disabled"?: string;
}

export type StepperRootProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperRootOptions & Partial<StepperRootCommonProps<ElementOf<T>>>;

export function StepperRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepperRootProps<T>>
) {
	const defaultId = `stepper-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as StepperRootProps
	);

	const [local, others] = splitProps(mergedProps, [
		"step",
		"defaultStep",
		"onStepChange",
		"disabled",
		"maxSteps",
		"children",
	]);

	const state = createControllableSignal({
		value: () => local.step,
		defaultValue: () => local.defaultStep ?? 0,
		onChange: local.onStepChange,
	});

	// Ensure state[0]() returns a number
	const currentStep = () => state[0]() ?? 0;

	const context: StepperContextValue = {
		step: currentStep,
		setStep: state[1],
		isDisabled: () => local.disabled ?? false,
		isCompleted: () => {
			const step = currentStep();
			return step > local.maxSteps - 1;
		},
		maxSteps: () => local.maxSteps,
		isLastStep: () => {
			const step = currentStep();
			return step === local.maxSteps - 1;
		},
	};

	return (
		<StepperContext.Provider value={context}>
			<Polymorphic<StepperRootRenderProps>
				as="div"
				data-disabled={local.disabled ? "" : undefined}
				{...others}
			>
				{local.children}
			</Polymorphic>
		</StepperContext.Provider>
	);
}

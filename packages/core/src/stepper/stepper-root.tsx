import { Tabs } from "../tabs";
import { mergeDefaultProps } from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createUniqueId,
	splitProps,
	createSignal,
} from "solid-js";

import { type ElementOf, type PolymorphicProps } from "../polymorphic";
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

	const [internalStep, setInternalStep] = createSignal(local.defaultStep ?? 0);

	const currentStep = () => local.step ?? internalStep();

	const value = () => currentStep().toString();
	const defaultValue = () => local.defaultStep?.toString();

	const context: StepperContextValue = {
		step: currentStep,
		setStep: (step: number | ((prev: number) => number)) => {
			const newStep = typeof step === 'function' ? step(currentStep()) : step;
			if (!local.onStepChange) {
				setInternalStep(newStep);
			} else {
				local.onStepChange?.(newStep);
			}
		},
		isDisabled: () => local.disabled ?? false,
		isCompleted: () => currentStep() > local.maxSteps - 1,
		maxSteps: () => local.maxSteps,
		isLastStep: () => currentStep() === local.maxSteps - 1,
	};

	return (
		<StepperContext.Provider value={context}>
			<Tabs
				value={value()}
				defaultValue={defaultValue()}
				disabled={local.disabled}
				{...others}
			>
				{local.children}
			</Tabs>
		</StepperContext.Provider>
	);
}

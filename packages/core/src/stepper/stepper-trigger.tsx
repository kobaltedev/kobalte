import { composeEventHandlers } from "@kobalte/utils";
import { type Component, type ValidComponent, splitProps, JSX } from "solid-js";
import * as Button from "../button";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperTriggerOptions {
	/** The step number this trigger controls */
	step: number;
}

export interface StepperTriggerCommonProps<T extends HTMLElement = HTMLElement> {
	onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepperTriggerRenderProps
	extends StepperTriggerCommonProps,
	Button.ButtonRootRenderProps { }

export type StepperTriggerProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperTriggerOptions & Partial<StepperTriggerCommonProps<ElementOf<T>>>;

export function StepperTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepperTriggerProps<T>>
) {
	const context = useStepperContext();
	const [local, others] = splitProps(props as StepperTriggerProps, ["step", "onClick"]);

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
		context.setStep(local.step);
	};

	const isDisabled = () => context.isDisabled();

	return (
		<Button.Root<Component<Omit<StepperTriggerRenderProps, keyof Button.ButtonRootRenderProps>>>
			disabled={isDisabled()}
			onClick={composeEventHandlers([local.onClick, onClick])}
			{...others}
		/>
	);
}

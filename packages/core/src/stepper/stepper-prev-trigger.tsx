import { composeEventHandlers } from "@kobalte/utils";
import { type Component, type ValidComponent, splitProps, JSX } from "solid-js";
import * as Button from "../button";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperPrevTriggerOptions { }

export interface StepperPrevTriggerCommonProps<T extends HTMLElement = HTMLElement> {
	onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepperPrevTriggerRenderProps
	extends StepperPrevTriggerCommonProps,
	Button.ButtonRootRenderProps { }

export type StepperPrevTriggerProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperPrevTriggerOptions & Partial<StepperPrevTriggerCommonProps<ElementOf<T>>>;

export function StepperPrevTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepperPrevTriggerProps<T>>
) {
	const context = useStepperContext();
	const [local, others] = splitProps(props as StepperPrevTriggerProps, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
		if (context.step() > 0) {
			context.setStep(context.step() - 1);
		}
	};

	const isDisabled = () => context.isDisabled() || context.step() === 0;

	return (
		<Button.Root<Component<Omit<StepperPrevTriggerRenderProps, keyof Button.ButtonRootRenderProps>>>
			disabled={isDisabled()}
			aria-disabled={isDisabled() || undefined}
			data-disabled={isDisabled() ? "" : undefined}
			onClick={composeEventHandlers([local.onClick, onClick])}
			{...others}
		/>
	);
}

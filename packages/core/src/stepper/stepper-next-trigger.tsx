import { composeEventHandlers } from "@kobalte/utils";
import { type Component, type ValidComponent, splitProps, JSX, Show } from "solid-js";
import * as Button from "../button";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperNextTriggerOptions { }

export interface StepperNextTriggerCommonProps<T extends HTMLElement = HTMLElement> {
	onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepperNextTriggerRenderProps
	extends StepperNextTriggerCommonProps,
	Button.ButtonRootRenderProps { }

export type StepperNextTriggerProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperNextTriggerOptions & Partial<StepperNextTriggerCommonProps<ElementOf<T>>>;

export function StepperNextTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepperNextTriggerProps<T>>
) {
	const context = useStepperContext();
	const [local, others] = splitProps(props as StepperNextTriggerProps, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
		context.setStep(context.step() + 1);
	};

	const isDisabled = () => context.isDisabled() || context.isCompleted();

	return (
		<Show when={!context.isCompleted()}>
			<Button.Root<Component<Omit<StepperNextTriggerRenderProps, keyof Button.ButtonRootRenderProps>>>
				disabled={isDisabled()}
				onClick={composeEventHandlers([local.onClick, onClick])}
				{...others}
			/>
		</Show>
	);
}

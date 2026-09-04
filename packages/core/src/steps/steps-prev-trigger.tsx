import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useStepsContext } from "./steps-context";

export interface StepsPrevTriggerOptions {}

export interface StepsPrevTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepsPrevTriggerRenderProps
	extends StepsPrevTriggerCommonProps,
		Button.ButtonRootRenderProps {
	disabled: boolean | undefined;
}

export type StepsPrevTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsPrevTriggerOptions &
	Partial<StepsPrevTriggerCommonProps<ElementOf<T>>>;

/**
 * A button that returns to the previous step.
 */
export function StepsPrevTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepsPrevTriggerProps<T>>,
) {
	const context = useStepsContext();

	const others = omit(props as StepsPrevTriggerProps, "onClick");

	return (
		<Button.Root<
			Component<
				Omit<StepsPrevTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			onClick={composeEventHandlers([props.onClick, context.goToPrevStep])}
			disabled={!context.hasPrevStep()}
			{...others}
		/>
	);
}

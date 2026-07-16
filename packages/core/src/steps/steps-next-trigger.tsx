import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useStepsContext } from "./steps-context";

export interface StepsNextTriggerOptions {}

export interface StepsNextTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepsNextTriggerRenderProps
	extends StepsNextTriggerCommonProps,
		Button.ButtonRootRenderProps {
	disabled: boolean | undefined;
}

export type StepsNextTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsNextTriggerOptions &
	Partial<StepsNextTriggerCommonProps<ElementOf<T>>>;

/**
 * A button that advances to the next step.
 */
export function StepsNextTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepsNextTriggerProps<T>>,
) {
	const context = useStepsContext();

	const others = omit(props as StepsNextTriggerProps, "onClick");

	return (
		<Button.Root<
			Component<
				Omit<StepsNextTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			onClick={composeEventHandlers([props.onClick, context.goToNextStep])}
			disabled={!context.hasNextStep()}
			{...others}
		/>
	);
}

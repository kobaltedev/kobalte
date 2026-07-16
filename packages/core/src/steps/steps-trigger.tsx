import { composeEventHandlers, type Orientation } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useStepsContext } from "./steps-context";
import { useStepsItemContext } from "./steps-item-context";

export interface StepsTriggerOptions {}

export interface StepsTriggerCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepsTriggerRenderProps
	extends StepsTriggerCommonProps,
		Button.ButtonRootRenderProps {
	"data-orientation": Orientation;
	"data-state": "open" | "closed";
	"data-complete": "" | undefined;
	"data-current": "" | undefined;
	"data-incomplete": "" | undefined;
	"aria-current": "step" | undefined;
	"aria-controls": string | undefined;
}

export type StepsTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsTriggerOptions & Partial<StepsTriggerCommonProps<ElementOf<T>>>;

/**
 * A button that navigates directly to the step it belongs to.
 */
export function StepsTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepsTriggerProps<T>>,
) {
	const context = useStepsContext();
	const itemContext = useStepsItemContext();

	const others = omit(props as StepsTriggerProps, "id", "onClick");

	const state = () => context.getItemState(itemContext.index());
	const isCurrent = () => state() === "current";

	const id = () =>
		(props as StepsTriggerProps).id ??
		context.generateId(`trigger-${itemContext.index()}`);

	const handleClick = () => {
		context.changeStep(itemContext.index());
	};

	return (
		<Button.Root<
			Component<Omit<StepsTriggerRenderProps, keyof Button.ButtonRootRenderProps>>
		>
			id={id()}
			onClick={composeEventHandlers([props.onClick, handleClick])}
			data-orientation={context.orientation()}
			data-state={isCurrent() ? "open" : "closed"}
			data-complete={state() === "complete" ? "" : undefined}
			data-current={isCurrent() ? "" : undefined}
			data-incomplete={state() === "incomplete" ? "" : undefined}
			aria-current={isCurrent() ? "step" : undefined}
			aria-controls={context.generateId(`content-${itemContext.index()}`)}
			{...others}
		/>
	);
}

import type { Orientation } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Tabs, type TabsTriggerRenderProps } from "../tabs";
import { useStepsContext } from "./steps-context";
import { useStepsItemContext } from "./steps-item-context";

export interface StepsTriggerOptions {}

export interface StepsTriggerCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface StepsTriggerRenderProps
	extends StepsTriggerCommonProps,
		TabsTriggerRenderProps {
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
 * A button that navigates directly to the step it belongs to. Wraps
 * `Tabs.Trigger` internally — its click and Enter/Space activation already
 * perform "select this key", which flows into `Steps.Root`'s controlled
 * `Tabs` `onChange`, which runs it through `changeStep`'s `linear` validation
 * before the current step value is ever allowed to update.
 */
export function StepsTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, StepsTriggerProps<T>>,
) {
	const context = useStepsContext();
	const itemContext = useStepsItemContext();

	const others = omit(props as StepsTriggerProps, "id");

	const state = () => context.getItemState(itemContext.index());
	const isCurrent = () => state() === "current";

	const id = () =>
		(props as StepsTriggerProps).id ??
		context.generateId(`trigger-${itemContext.index()}`);

	return (
		<Tabs.Trigger<
			Component<Omit<StepsTriggerRenderProps, keyof TabsTriggerRenderProps>>
		>
			value={String(itemContext.index())}
			id={id()}
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

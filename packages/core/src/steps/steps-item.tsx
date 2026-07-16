import type { Orientation } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import type { StepState } from "./steps-context";
import { useStepsContext } from "./steps-context";
import { StepsItemContext } from "./steps-item-context";

export interface StepsItemOptions {
	/** The index of this step. */
	index: number;
}

export interface StepsItemCommonProps<T extends HTMLElement = HTMLElement> {}

export interface StepsItemRenderProps extends StepsItemCommonProps {
	"data-orientation": Orientation;
	"data-complete": "" | undefined;
	"data-current": "" | undefined;
	"data-incomplete": "" | undefined;
}

export type StepsItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsItemOptions & Partial<StepsItemCommonProps<ElementOf<T>>>;

/**
 * The container for a single step. Establishes the item context consumed by
 * `Steps.Trigger`, `Steps.Indicator` and `Steps.Separator`.
 */
export function StepsItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsItemProps<T>>,
) {
	const context = useStepsContext();

	const others = omit(props as StepsItemProps, "index");

	const state = (): StepState => context.getItemState((props as StepsItemProps).index);

	return (
		<StepsItemContext value={{ index: () => (props as StepsItemProps).index }}>
			<Polymorphic<StepsItemRenderProps>
				as="div"
				data-orientation={context.orientation()}
				data-complete={state() === "complete" ? "" : undefined}
				data-current={state() === "current" ? "" : undefined}
				data-incomplete={state() === "incomplete" ? "" : undefined}
				{...others}
			/>
		</StepsItemContext>
	);
}

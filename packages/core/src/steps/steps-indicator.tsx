import type { ValidComponent } from "@solidjs/web";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStepsContext } from "./steps-context";
import { useStepsItemContext } from "./steps-item-context";

export interface StepsIndicatorOptions {}

export interface StepsIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface StepsIndicatorRenderProps extends StepsIndicatorCommonProps {
	"data-complete": "" | undefined;
	"data-current": "" | undefined;
	"data-incomplete": "" | undefined;
}

export type StepsIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsIndicatorOptions & Partial<StepsIndicatorCommonProps<ElementOf<T>>>;

/**
 * A visual marker for a step's status. Renders whatever children you provide
 * (e.g. the step number or a checkmark) — style it using the `data-complete`
 * / `data-current` / `data-incomplete` attributes.
 */
export function StepsIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsIndicatorProps<T>>,
) {
	const context = useStepsContext();
	const itemContext = useStepsItemContext();

	const state = () => context.getItemState(itemContext.index());

	return (
		<Polymorphic<StepsIndicatorRenderProps>
			as="div"
			data-complete={state() === "complete" ? "" : undefined}
			data-current={state() === "current" ? "" : undefined}
			data-incomplete={state() === "incomplete" ? "" : undefined}
			{...(props as StepsIndicatorProps)}
		/>
	);
}

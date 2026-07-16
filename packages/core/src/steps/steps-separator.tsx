import type { ValidComponent } from "@solidjs/web";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStepsContext } from "./steps-context";
import { useStepsItemContext } from "./steps-item-context";

export interface StepsSeparatorOptions {}

export interface StepsSeparatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface StepsSeparatorRenderProps extends StepsSeparatorCommonProps {
	"aria-hidden": "true";
	"data-complete": "" | undefined;
	"data-current": "" | undefined;
	"data-incomplete": "" | undefined;
}

export type StepsSeparatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsSeparatorOptions & Partial<StepsSeparatorCommonProps<ElementOf<T>>>;

/**
 * A purely visual divider between two steps, styled using the same
 * `data-complete` / `data-current` / `data-incomplete` attributes as
 * `Steps.Indicator` (reflecting the step it follows). Hidden from assistive
 * technology (`aria-hidden`), matching `Breadcrumbs.Separator`. Typically
 * hidden visually after the last item via `:last-child` in CSS.
 */
export function StepsSeparator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsSeparatorProps<T>>,
) {
	const context = useStepsContext();
	const itemContext = useStepsItemContext();

	const state = () => context.getItemState(itemContext.index());

	return (
		<Polymorphic<StepsSeparatorRenderProps>
			as="div"
			aria-hidden="true"
			data-complete={state() === "complete" ? "" : undefined}
			data-current={state() === "current" ? "" : undefined}
			data-incomplete={state() === "incomplete" ? "" : undefined}
			{...(props as StepsSeparatorProps)}
		/>
	);
}

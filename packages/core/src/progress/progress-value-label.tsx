import { JSX, ValidComponent } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressValueLabelOptions {}

export interface ProgressValueLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ProgressValueLabelRenderProps
	extends ProgressValueLabelCommonProps,
		ProgressDataSet {
	children: JSX.Element;
}

export type ProgressValueLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressValueLabelOptions &
	Partial<ProgressValueLabelCommonProps<ElementOf<T>>>;

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function ProgressValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressValueLabelProps<T>>,
) {
	const context = useProgressContext();

	return (
		<Polymorphic<ProgressValueLabelRenderProps>
			as="div"
			children={context.valueLabel()}
			{...context.dataset()}
			{...(props as ProgressValueLabelProps)}
		/>
	);
}

import { JSX, ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressValueLabelOptions {}

export interface ProgressValueLabelCommonProps {}

export interface ProgressValueLabelRenderProps
	extends ProgressValueLabelCommonProps,
		ProgressDataSet {
	children: JSX.Element;
}

export type ProgressValueLabelProps = ProgressValueLabelOptions &
	Partial<ProgressValueLabelCommonProps>;

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function ProgressValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressValueLabelProps>,
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

import { JSX, ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { SliderDataSet, useSliderContext } from "./slider-context";

export interface SliderValueLabelOptions {}

export interface SliderValueLabelCommonProps {}

export interface SliderValueLabelRenderProps
	extends SliderValueLabelCommonProps,
		SliderDataSet {
	children: JSX.Element;
}

export type SliderValueLabelProps = SliderValueLabelOptions &
	Partial<SliderValueLabelCommonProps>;

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function SliderValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SliderValueLabelProps>,
) {
	const context = useSliderContext();

	return (
		<Polymorphic<SliderValueLabelRenderProps>
			as="div"
			{...context.dataset()}
			{...(props as SliderValueLabelProps)}
		>
			{context.getValueLabel?.({
				values: context.state.values(),
				max: context.maxValue(),
				min: context.minValue(),
			})}
		</Polymorphic>
	);
}

import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type SliderDataSet, useSliderContext } from "./slider-context";

export interface SliderValueLabelOptions {}

export interface SliderValueLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface SliderValueLabelRenderProps
	extends SliderValueLabelCommonProps,
		SliderDataSet {
	children: JSX.Element;
}

export type SliderValueLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SliderValueLabelOptions &
	Partial<SliderValueLabelCommonProps<ElementOf<T>>>;

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function SliderValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SliderValueLabelProps<T>>,
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

import { type JSX, type ValidComponent, splitProps } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type SliderDataSet, useSliderContext } from "./slider-context";

export interface SliderFillOptions {}

export interface SliderFillCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
}

export interface SliderFillRenderProps
	extends SliderFillCommonProps,
		SliderDataSet {}

export type SliderFillProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SliderFillOptions & Partial<SliderFillCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the slider value.
 * Used to visually show the fill of `Slider.Track`.
 */
export function SliderFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SliderFillProps<T>>,
) {
	const context = useSliderContext();

	const [local, others] = splitProps(props as SliderFillProps, ["style"]);

	const percentages = () => {
		return context.state
			.values()
			.map((value) => context.state.getValuePercent(value) * 100);
	};
	const offsetStart = () => {
		return context.state.values().length > 1 ? Math.min(...percentages()) : 0;
	};

	const offsetEnd = () => {
		return 100 - Math.max(...percentages());
	};

	return (
		<Polymorphic<SliderFillRenderProps>
			as="div"
			style={combineStyle(
				{
					[context.startEdge()]: `${offsetStart()}%`,
					[context.endEdge()]: `${offsetEnd()}%`,
				},
				local.style,
			)}
			{...context.dataset()}
			{...others}
		/>
	);
}
